
export const setupHeadTracking = (videoElement: HTMLVideoElement | null, onWarning: (message: string) => void) => {
  if (!videoElement) return;

  // Basic head position detection using video frames
  const detectHeadPosition = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0);
    
    // Get the middle third of the frame
    const centerX = canvas.width / 3;
    const width = canvas.width / 3;
    
    // Sample pixels from left and right regions
    const leftRegion = context.getImageData(0, 0, centerX, canvas.height);
    const rightRegion = context.getImageData(centerX + width, 0, width, canvas.height);
    
    // Calculate average brightness for each region
    const leftBrightness = calculateAverageBrightness(leftRegion.data);
    const rightBrightness = calculateAverageBrightness(rightRegion.data);
    
    // If there's significant difference in brightness, user might be looking to the sides
    const threshold = 20;
    if (Math.abs(leftBrightness - rightBrightness) > threshold) {
      onWarning("Please maintain eye contact with the camera");
    }
  };

  const calculateAverageBrightness = (pixels: Uint8ClampedArray) => {
    let total = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      total += (r + g + b) / 3;
    }
    return total / (pixels.length / 4);
  };

  // Run detection every 500ms
  const interval = setInterval(detectHeadPosition, 500);

  return () => clearInterval(interval);
};
