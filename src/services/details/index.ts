import { TYoutubeStatsProps } from "@/types/details";
import axiosInstance from "../axiosInstance";

export const getYoutubeStats = async (obj: TYoutubeStatsProps) => {
  const resp = await axiosInstance.post("/programs/youtube_stats", obj);
  return resp.data;
};

export const getTopVideos = async () => {
  const resp = await axiosInstance.post("/programs/topprogram", {});
  return resp.data;
};

export const getTopViewedEpisodes = async (programId: number) => {
  const resp = await axiosInstance.post("/programs/episodes", {
    program_id: programId,
  });
  return resp.data;
};

export const getTopChannels = async () => {
  const resp = await axiosInstance.post("/streams/topstreams", {});
  return resp.data;
};
