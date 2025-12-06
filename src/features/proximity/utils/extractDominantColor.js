/**
 * Extract dominant color from an image using canvas
 * @param {string} imageSrc - Image URL
 * @returns {Promise<string>} RGB color string
 */
export async function extractDominantColor(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Use small canvas for performance
      canvas.width = 100;
      canvas.height = 100;
      
      ctx.drawImage(img, 0, 0, 100, 100);
      
      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      
      // Calculate average color
      let r = 0, g = 0, b = 0;
      const pixelCount = imageData.length / 4;
      
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }
      
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      resolve(`${r}, ${g}, ${b}`);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}
