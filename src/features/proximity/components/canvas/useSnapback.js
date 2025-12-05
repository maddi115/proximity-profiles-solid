import { createSignal, onCleanup } from "solid-js";

export function useSnapback(duration = 1200) {
  const [isSnapping, setIsSnapping] = createSignal(false);
  const [snapProgress, setSnapProgress] = createSignal(0);
  const [snapStart, setSnapStart] = createSignal({ x: 0, y: 0 });
  const [snapTarget, setSnapTarget] = createSignal({ x: 0, y: 0 });
  
  let animationId;
  let startTime;
  
  const easeOutBack = (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  
  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    setSnapProgress(progress);
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      setIsSnapping(false);
      startTime = null;
    }
  };
  
  const currentOffset = () => {
    if (!isSnapping()) return null;
    
    const progress = snapProgress();
    const eased = easeOutBack(progress);
    const start = snapStart();
    const target = snapTarget();
    
    return {
      x: start.x + (target.x - start.x) * eased,
      y: start.y + (target.y - start.y) * eased
    };
  };
  
  const startSnapback = (from, to) => {
    setSnapStart(from);
    setSnapTarget(to);
    setSnapProgress(0);
    setIsSnapping(true);
    startTime = null;
    animationId = requestAnimationFrame(animate);
  };
  
  const stopSnapback = () => {
    setIsSnapping(false);
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
  
  onCleanup(() => {
    stopSnapback();
  });
  
  return {
    isSnapping,
    currentOffset,
    startSnapback,
    stopSnapback
  };
}
