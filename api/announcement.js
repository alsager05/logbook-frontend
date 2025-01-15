import api from "./axios";
export const getAllAnnouncements = async () => {
  try {
    const response = await api.get("/announcements/");
    console.log("hhh", response);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getAllAnnouncements();
