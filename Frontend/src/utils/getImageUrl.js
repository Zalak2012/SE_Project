export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/default-doctor.png";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Use the API URL from environment or fallback to localhost:5000
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  // Ensure the imagePath starts with /
  const formattedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  return `${API_URL}${formattedPath}`;
};
