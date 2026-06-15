const LOCAL_API = "http://localhost:5000/api";

const envUrl = import.meta.env.VITE_API_URL;

// If envUrl is null, undefined, empty, or blank → use LOCAL
export const API_URL =
  envUrl && envUrl.trim() !== "" ? envUrl : LOCAL_API;
