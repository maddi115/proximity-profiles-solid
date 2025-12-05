import { onMount, onCleanup, createSignal, createEffect, createMemo } from "solid-js";
import styles from "./appleWatch.module.css";
import { generateHoneycombPositions, getGridBounds } from "./layout/honeycombLayout";
import { useSnapback } from "./canvas/useSnapback";
import { useCulling } from "./canvas/useCulling";

const RADIUS = 35;
const PADDING = 12;
const SCALE_FACTOR = 220;
const COLORS = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];

export function AppleWatchGrid(props) {
  let canvasRef;
  let overlayRef;
  let ctx;
  let animationId;
  const images = new Map();
  
  // Reactive state
  const [circles, setCircles] = createSignal([]);
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });
  const [cullingBox, setCullingBox] = createSignal({ x: 0, y: 0, width: 500, height: 350 });
  const [isDragging, setIsDragging] = createSignal(false);
  const [centerOffset, setCenterOffset] = createSignal({ x: 0, y: 0 });
  const [dragStart, setDragStart] = createSignal({ x: 0, y: 0 });
  const [dragInitialOffset, setDragInitialOffset] = createSignal({ x: 0, y: 0 });
  
  // Reactive culling calculations
  const culling = useCulling(circles, offset, cullingBox, RADIUS, SCALE_FACTOR);
  
  // Reactive snapback
  const snapback = useSnapback(1200);
  
  // Auto-update offset during snapback (reactive effect)
  createEffect(() => {
    const snapOffset = snapback.currentOffset();
    if (snapOffset) {
      setOffset(snapOffset);
    }
  });
  
  // Auto-trigger snapback when no profiles visible (reactive effect)
  createEffect(() => {
    const visible = culling.visibleCircles();
    if (visible.length === 0 && !isDragging() && !snapback.isSnapping()) {
      snapback.startSnapback(offset(), centerOffset());
    }
  });
  
  // Auto-notify parent of centered profile changes (reactive effect)
  createEffect(() => {
    const centered = culling.centeredProfile();
    if (centered) {
      props.onCenterProfileChange?.(centered.id);
    }
  });

  onMount(() => {
    ctx = canvasRef.getContext("2d");
    
    // Load images
    props.profiles?.forEach(profile => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = profile.img;
      images.set(profile.id, img);
    });
    
    const handleResize = () => {
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
      
      const box = cullingBox();
      const newBox = {
        x: (canvasRef.width - box.width) / 2,
        y: (canvasRef.height - box.height) / 2,
        width: box.width,
        height: box.height
      };
      setCullingBox(newBox);
      
      if (overlayRef) {
        overlayRef.style.left = `${newBox.x}px`;
        overlayRef.style.top = `${newBox.y}px`;
        overlayRef.style.width = `${newBox.width}px`;
        overlayRef.style.height = `${newBox.height}px`;
      }
      
      initCircles();
    };
    
    const initCircles = () => {
      const profiles = props.profiles || [];
      if (profiles.length === 0) return;
      
      const positions = generateHoneycombPositions(profiles.length, RADIUS, PADDING);
      
      const newCircles = profiles.map((profile, i) => ({
        x: positions[i].x,
        y: positions[i].y,
        color: COLORS[i % COLORS.length],
        profile: profile,
        id: profile.id
      }));
      
      setCircles(newCircles);
      
      const bounds = getGridBounds(positions, RADIUS);
      const box = cullingBox();
      const centered = {
        x: box.x + (box.width - bounds.width) / 2 - bounds.minX,
        y: box.y + (box.height - bounds.height) / 2 - bounds.minY
      };
      
      setCenterOffset(centered);
      setOffset(centered);
    };
    
    // Render loop - reads from reactive signals
    const draw = () => {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      
      const box = cullingBox();
      const currentOffset = offset();
      
      // Draw box border
      ctx.strokeStyle = isDragging() 
        ? 'rgba(255, 105, 180, 0.6)' 
        : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.clip();
      ctx.translate(currentOffset.x, currentOffset.y);
      
      // Render sorted visible circles (reactive)
      const sorted = culling.sortedVisibleCircles();
      
      sorted.forEach((circle) => {
        const scale = culling.getDistance(circle);
        
        ctx.save();
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
      
      // Debug info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.fillText(
        `${culling.visibleCircles().length}/${circles().length} visible`,
        box.x + 10,
        box.y + 25
      );
      
      animationId = requestAnimationFrame(draw);
    };
    
    // Event handlers
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragInitialOffset(offset());
      snapback.stopSnapback();
      if (overlayRef) overlayRef.style.cursor = "grabbing";
      
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging()) return;
      const start = dragStart();
      const initial = dragInitialOffset();
      setOffset({
        x: initial.x + (e.clientX - start.x),
        y: initial.y + (e.clientY - start.y)
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      if (overlayRef) overlayRef.style.cursor = "grab";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    
    const handleTouchStart = (e) => {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setDragInitialOffset(offset());
      snapback.stopSnapback();
      
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging()) return;
      e.preventDefault();
      const start = dragStart();
      const initial = dragInitialOffset();
      setOffset({
        x: initial.x + (e.touches[0].clientX - start.x),
        y: initial.y + (e.touches[0].clientY - start.y)
      });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    
    const handleClick = (e) => {
      const start = dragStart();
      const dragDist = Math.sqrt(
        Math.pow(e.clientX - start.x, 2) + Math.pow(e.clientY - start.y, 2)
      );
      
      if (dragDist > 5) return;
      
      const box = cullingBox();
      const rect = overlayRef.getBoundingClientRect();
      const clickX = e.clientX - rect.left + box.x;
      const clickY = e.clientY - rect.top + box.y;
      
      culling.visibleCircles().forEach((circle) => {
        const scale = culling.getDistance(circle);
        const currentOffset = offset();
        const screenX = circle.x + currentOffset.x;
        const screenY = circle.y + currentOffset.y;
        const dx = screenX - clickX;
        const dy = screenY - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < RADIUS * scale) {
          props.onProfileClick?.(circle.profile);
        }
      });
    };
    
    if (overlayRef) {
      overlayRef.addEventListener("mousedown", handleMouseDown);
      overlayRef.addEventListener("touchstart", handleTouchStart, { passive: false });
      overlayRef.addEventListener("click", handleClick);
    }
    
    window.addEventListener("resize", handleResize);
    
    handleResize();
    draw();
    
    onCleanup(() => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
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
