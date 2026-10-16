/**
 * imageCompressor.ts
 * Utility to compress and resize uploaded teacher profile images on PC and mobile devices.
 * Prevents localStorage QuotaExceededError and optimizes rendering speed.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Resizes and compresses an image file to a lightweight data URL
 */
export function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 480,
    maxHeight = 480,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('ឯកសារដែលបានជ្រើសរើសមិនមែនជារូបភាពទេ (Not an image file)'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('មិនអាចអានឯកសាររូបភាពបានទេ (Failed to read file)'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('មិនអាចផ្ទុករូបភាពបានទេ (Failed to load image)'));
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback if canvas context cannot be created
            return resolve(e.target?.result as string);
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed Data URL
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          // If canvas compression encounters an issue, fallback to original result
          resolve(e.target?.result as string);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Helper to test if a string represents an image (data URI, HTTP URL, Blob, etc.)
 */
export function isImageAvatar(avatar?: string | null): boolean {
  if (!avatar || typeof avatar !== 'string') return false;
  const trimmed = avatar.trim();
  return (
    trimmed.startsWith('data:image') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/') ||
    trimmed.includes('.jpg') ||
    trimmed.includes('.png') ||
    trimmed.includes('.webp') ||
    trimmed.includes('.jpeg')
  );
}
