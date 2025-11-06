import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE;
export async function apiGet(path) {
  try {
    const response = await axios.get(`${BASE}${path}`);
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}
