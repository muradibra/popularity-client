import axiosInstance from "../axiosInstance";

export type TFinalValues = {
  channels: number[];
  ratings: {
    [key: string]: number;
  };
  search: string;
  timeFrame: {
    from: string;
    to: string;
  };
};

export const getResults = async (values: TFinalValues) => {
  try {
    const { search, timeFrame, channels, ratings } = values;
    const from_date = timeFrame.from;
    const to_date = timeFrame.to;
    const min_rating = ratings.min;
    const max_rating = ratings.max;
    const stream_id = [...channels];

    const resp = await axiosInstance.post("/programs/stats", {
      search,
      from_date,
      to_date,
      min_rating,
      max_rating,
      stream_id,
    });

    return resp.data;
    // const params = new URLSearchParams();

    // if (search) params.append("search", search);
    // if (channels.length) params.append("channels", channels.join(","));
    // if (timeFrame.from) params.append("from", timeFrame.from);
    // if (timeFrame.to) params.append("to", timeFrame.to);
    // if (ratings.min) params.append("minRating", ratings.min.toString());
    // if (ratings.max) params.append("maxRating", ratings.max.toString());

    // return await axiosInstance.get(`/programs?${params.toString()}`);
  } catch (error) {
    console.error(error);
  }
};
