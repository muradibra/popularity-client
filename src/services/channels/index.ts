import axiosInstance from "../axiosInstance";

export const getActiveChannels = async () => {
  try {
    const resp = await axiosInstance.get("/active-channels");
    return resp.data;
  } catch (err) {
    console.error("Error executing query", err);
  }
};
