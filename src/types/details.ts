export type TYoutubeStatsProps = {
  program_id: number;
  from_date: string;
  to_date: string;
};

export type TProgramData = {
  avg_youtube_comments: number;
  avg_youtube_likes: number;
  avg_youtube_rate: number;
  avg_youtube_views: number;
  program_id: number;
  program_name: string;
  stream_name: string;
};

export type TProgramDetail = {
  avg_youtube_comments: number;
  avg_youtube_likes: number;
  avg_youtube_rate: number;
  avg_youtube_views: number;
  start_time: string;
  program_name: string;
};
