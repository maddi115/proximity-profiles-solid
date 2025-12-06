import { onMount, onCleanup, createEffect } from "solid-js";

/**
 * Creates a blurred background image effect using canvas
 * @param {Object} props
 * @param {string} props.src - Image URL to blur
 * @param {number} [props.blurAmount=15] - Blur strength in pixels
 * @param {number} [props.scale=1.1] - Scale factor for background
 */
export function BlurredBackground(props) {
  let canvasRef;
  let imgRef;
  
  const blurAmount = () => props.blurAmount || 15;
  const scale = () => props.scale || 1.1;
  
  const drawBlurredImage = () => {
    if (!canvasRef || !imgRef || !imgRef.complete) return;
    
    const ctx = canvasRef.getContext('2d');
    
    // Set canvas to be larger than container
    canvasRef.width = imgRef.naturalWidth + 120;
    canvasRef.height = imgRef.naturalHeight + 120;
    
    // Draw blurred background
    ctx.filter = `blur(${blurAmount()}px)`;
    ctx.drawImage(imgRef, 60, 60, imgRef.naturalWidth, imgRef.naturalHeight);
    ctx.filter = 'none';
  };
  
  onMount(() => {
    if (imgRef) {
      imgRef.onload = drawBlurredImage;
      // If image is already loaded (cached)
      if (imgRef.complete) {
        drawBlurredImage();
      }
    }
  });
  
  // Redraw when src changes
  createEffect(() => {
    props.src; // Track dependency
    if (imgRef && imgRef.complete) {
      drawBlurredImage();
    }
  });
  
  onCleanup(() => {
    if (imgRef) {
      imgRef.onload = null;
    }
  });
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      'border-radius': 'inherit',
      'z-index': 0
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale()})`,
          'max-width': 'none',
          'max-height': 'none',
          opacity: 0.6
        }}
      />
      <img
        ref={imgRef}
        src={props.src}
        crossorigin="anonymous"
        style={{ display: 'none' }}
        alt=""
      />
    </div>
  );
}
