export type TTopVideo = {
  picture_path: string;
  program_name: string;
  youtube_link: string;
  youtube_title: string;
  start_time: string;
  youtube_views: number;
};

export type TTopVideoProps = {
  start_time: string;
  youtube_link: string;
  youtube_views: number;
};
