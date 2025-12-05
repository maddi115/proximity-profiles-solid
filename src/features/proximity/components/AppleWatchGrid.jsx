import { onMount, onCleanup } from "solid-js";
import styles from "./appleWatch.module.css";

export function AppleWatchGrid(props) {
  let canvasRef;
  let overlayRef; // Invisible overlay for event handling
  let animationId;
  let images = new Map();
  
  const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];
  let ctx, circles = [], offsetX, offsetY;
  let startX, startY, oldOffsetX, oldOffsetY;
  let isDragging = false;
  let isSnapping = false;
  let snapStartTime = 0;
  let snapStartOffset = { x: 0, y: 0 };
  let snapTargetOffset = { x: 0, y: 0 };
  let lastCenteredProfile = null;
  
  const RADIUS = 35;
  const PADDING = 12;
  const SCALE_FACTOR = 220;
  const SNAP_DURATION = 1200;
  
  let cullingBox = {
    x: 0,
    y: 0,
    width: 500,
    height: 350
  };

  onMount(() => {
    ctx = canvasRef.getContext("2d");
    
    props.profiles?.forEach(profile => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = profile.img;
      images.set(profile.id, img);
    });
    
    const resize = () => {
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
      
      cullingBox.x = (canvasRef.width - cullingBox.width) / 2;
      cullingBox.y = (canvasRef.height - cullingBox.height) / 2;
      
      // Position the overlay div
      if (overlayRef) {
        overlayRef.style.left = `${cullingBox.x}px`;
        overlayRef.style.top = `${cullingBox.y}px`;
        overlayRef.style.width = `${cullingBox.width}px`;
        overlayRef.style.height = `${cullingBox.height}px`;
      }
      
      initCircles();
    };
    
    const initCircles = () => {
      circles = [];
      const profiles = props.profiles || [];
      
      if (profiles.length === 0) return;
      
      const positions = generateVerticalHoneycomb(profiles.length);
      
      profiles.forEach((profile, i) => {
        circles.push({
          x: positions[i].x,
          y: positions[i].y,
          color: colors[i % colors.length],
          profile: profile,
          id: profile.id
        });
      });
      
      const bounds = getGridBounds(positions);
      offsetX = cullingBox.x + (cullingBox.width - bounds.width) / 2 - bounds.minX;
      offsetY = cullingBox.y + (cullingBox.height - bounds.height) / 2 - bounds.minY;
      
      snapTargetOffset.x = offsetX;
      snapTargetOffset.y = offsetY;
    };
    
    const generateVerticalHoneycomb = (count) => {
      const spacing = RADIUS * 2 + PADDING;
      const verticalSpacing = spacing * 0.866;
      const positions = [];
      
      let row = 0;
      let placed = 0;
      
      while (placed < count) {
        let itemsInRow, offsetX;
        
        if (row === 0) {
          itemsInRow = 1;
          offsetX = 0;
        } else if (row % 2 === 1) {
          itemsInRow = 3;
          offsetX = 0;
        } else {
          itemsInRow = 2;
          offsetX = spacing / 2;
        }
        
        for (let col = 0; col < itemsInRow && placed < count; col++) {
          const x = (col - (itemsInRow - 1) / 2) * spacing;
          const y = row * verticalSpacing;
          
          positions.push({ x, y });
          placed++;
        }
        
        row++;
      }
      
      return positions;
    };
    
    const getGridBounds = (positions) => {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      positions.forEach(pos => {
        minX = Math.min(minX, pos.x - RADIUS);
        maxX = Math.max(maxX, pos.x + RADIUS);
        minY = Math.min(minY, pos.y - RADIUS);
        maxY = Math.max(maxY, pos.y + RADIUS);
      });
      
      return {
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX,
        height: maxY - minY
      };
    };
    
    const getDistance = (circle) => {
      const centerX = cullingBox.x + cullingBox.width / 2;
      const centerY = cullingBox.y + cullingBox.height / 2;
      const dx = circle.x + offsetX - centerX;
      const dy = circle.y + offsetY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let scale = 1 - dist / SCALE_FACTOR;
      return scale > 0.3 ? scale : 0.3;
    };
    
    const isInCullingBox = (circle) => {
      const scale = getDistance(circle);
      const scaledRadius = RADIUS * scale;
      
      const screenX = circle.x + offsetX;
      const screenY = circle.y + offsetY;
      
      return (
        screenX - scaledRadius >= cullingBox.x &&
        screenX + scaledRadius <= cullingBox.x + cullingBox.width &&
        screenY - scaledRadius >= cullingBox.y &&
        screenY + scaledRadius <= cullingBox.y + cullingBox.height
      );
    };
    
    const getCenteredProfile = () => {
      const centerX = cullingBox.x + cullingBox.width / 2;
      const centerY = cullingBox.y + cullingBox.height / 2;
      
      const visibleCircles = circles.filter(isInCullingBox);
      if (visibleCircles.length === 0) return null;
      
      let closest = visibleCircles[0];
      let minDist = Infinity;
      
      visibleCircles.forEach(circle => {
        const screenX = circle.x + offsetX;
        const screenY = circle.y + offsetY;
        const dx = screenX - centerX;
        const dy = screenY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist) {
          minDist = dist;
          closest = circle;
        }
      });
      
      return closest;
    };
    
    const easeOutBack = (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    
    const startSnapback = () => {
      isSnapping = true;
      snapStartTime = performance.now();
      snapStartOffset.x = offsetX;
      snapStartOffset.y = offsetY;
    };
    
    const updateSnapback = (currentTime) => {
      if (!isSnapping) return;
      
      const elapsed = currentTime - snapStartTime;
      const progress = Math.min(elapsed / SNAP_DURATION, 1);
      const eased = easeOutBack(progress);
      
      offsetX = snapStartOffset.x + (snapTargetOffset.x - snapStartOffset.x) * eased;
      offsetY = snapStartOffset.y + (snapTargetOffset.y - snapStartOffset.y) * eased;
      
      if (progress >= 1) {
        isSnapping = false;
        offsetX = snapTargetOffset.x;
        offsetY = snapTargetOffset.y;
      }
    };
    
    const draw = () => {
      const currentTime = performance.now();
      
      updateSnapback(currentTime);
      
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      
      ctx.strokeStyle = isDragging ? 'rgba(255, 105, 180, 0.6)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(cullingBox.x, cullingBox.y, cullingBox.width, cullingBox.height);
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(cullingBox.x, cullingBox.y, cullingBox.width, cullingBox.height);
      ctx.clip();
      
      ctx.translate(offsetX, offsetY);
      
      const visibleCircles = circles.filter(isInCullingBox);
      
      if (visibleCircles.length === 0 && !isDragging && !isSnapping) {
        startSnapback();
      }
      
      const centeredProfile = getCenteredProfile();
      if (centeredProfile && centeredProfile.id !== lastCenteredProfile) {
        lastCenteredProfile = centeredProfile.id;
        props.onCenterProfileChange?.(centeredProfile.id);
      }
      
      const sorted = [...visibleCircles].sort((a, b) => {
        return getDistance(a) - getDistance(b);
      });
      
      sorted.forEach((circle) => {
        ctx.save();
        const scale = getDistance(circle);
        
        ctx.translate(circle.x, circle.y);
        ctx.scale(scale, scale);
        
        if (scale > 0.8) {
          ctx.shadowColor = circle.color;
          ctx.shadowBlur = 20;
        }
        
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(0, 0, RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        const img = images.get(circle.id);
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, RADIUS - 4, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, -RADIUS + 4, -RADIUS + 4, (RADIUS - 4) * 2, (RADIUS - 4) * 2);
          ctx.restore();
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, RADIUS - 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });
      
      ctx.restore();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText(`${visibleCircles.length}/${circles.length} visible`, cullingBox.x + 10, cullingBox.y + 25);
      
      animationId = requestAnimationFrame(draw);
    };
    
    const cleanupDrag = () => {
      isDragging = false;
      if (overlayRef) overlayRef.style.cursor = "grab";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    
    const handleMouseDown = (e) => {
      isSnapping = false;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      oldOffsetX = offsetX;
      oldOffsetY = offsetY;
      if (overlayRef) overlayRef.style.cursor = "grabbing";
      
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      offsetX = oldOffsetX + (e.clientX - startX);
      offsetY = oldOffsetY + (e.clientY - startY);
    };
    
    const handleMouseUp = () => {
      cleanupDrag();
    };
    
    const handleTouchStart = (e) => {
      isSnapping = false;
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      oldOffsetX = offsetX;
      oldOffsetY = offsetY;
      
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      offsetX = oldOffsetX + (e.touches[0].clientX - startX);
      offsetY = oldOffsetY + (e.touches[0].clientY - startY);
    };
    
    const handleTouchEnd = () => {
      cleanupDrag();
    };
    
    const handleClick = (e) => {
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
      );
      
      if (dragDistance > 5) return;
      
      const rect = overlayRef.getBoundingClientRect();
      const clickX = e.clientX - rect.left + cullingBox.x;
      const clickY = e.clientY - rect.top + cullingBox.y;
      
      const visibleCircles = circles.filter(isInCullingBox);
      
      visibleCircles.forEach((circle) => {
        const scale = getDistance(circle);
        const screenX = circle.x + offsetX;
        const screenY = circle.y + offsetY;
        const dx = screenX - clickX;
        const dy = screenY - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < RADIUS * scale) {
          props.onProfileClick?.(circle.profile);
        }
      });
    };
    
    // Set up overlay for event handling
    if (overlayRef) {
      overlayRef.addEventListener("mousedown", handleMouseDown);
      overlayRef.addEventListener("touchstart", handleTouchStart, { passive: false });
      overlayRef.addEventListener("click", handleClick);
    }
    
    window.addEventListener("resize", resize);
    
    resize();
    draw();
    
    onCleanup(() => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      cleanupDrag();
      if (overlayRef) {
        overlayRef.removeEventListener("mousedown", handleMouseDown);
        overlayRef.removeEventListener("touchstart", handleTouchStart);
        overlayRef.removeEventListener("click", handleClick);
      }
    });
  });
  
  return (
    <>
      <canvas ref={canvasRef} class={styles.canvas} />
      <div 
        ref={overlayRef}
        style={{
          position: 'fixed',
          cursor: 'grab',
          'touch-action': 'none',
          'z-index': 100
        }}
      />
    </>
  );
}
