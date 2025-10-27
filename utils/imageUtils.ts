export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL like "data:image/jpeg;base64,..."
      const parts = result.split(';base64,');
      const mimeType = parts[0].split(':')[1];
      const data = parts[1];
      resolve({ data, mimeType });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
