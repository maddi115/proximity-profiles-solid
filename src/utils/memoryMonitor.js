/**
 * Memory Monitor - Track memory usage in development
 */

let lastMemory = 0;

export function logMemory(label = 'Memory') {
  if (performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
    const total = Math.round(performance.memory.totalJSHeapSize / 1048576);
    const delta = used - lastMemory;
    
    console.log(`💾 ${label}: ${used}MB / ${total}MB (${delta > 0 ? '+' : ''}${delta}MB)`);
    lastMemory = used;
  }
}

// Check for leaks every 10 seconds
if (import.meta.env.DEV) {
  setInterval(() => {
    if (performance.memory) {
      const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
      console.log(`💾 Heap: ${used}MB`);
    }
  }, 10000);
}
