import api from "./axios";
export const getAllAnnouncements = async () => {
  try {
    const response = await api.get("/announcements");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getAllAnnouncements();
