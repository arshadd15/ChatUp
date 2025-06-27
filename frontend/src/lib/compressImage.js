import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  if (!file) return;

  const options = {
    maxSizeMB: 0.6,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
    return base64;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
