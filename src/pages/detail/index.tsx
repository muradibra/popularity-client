import {
  getTopChannels,
  getTopVideos,
  getTopViewedEpisodes,
  getYoutubeStats,
} from "@/services/details";
import { useQueries } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import * as Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { useRef } from "react";
import { TProgramDetail } from "@/types/details";
import { format } from "date-fns";
import { TTopVideo, TTopVideoProps } from "@/types/topVideo";
import { TTopChannel } from "@/types/channels";

const ProgramDetailPage = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [
    { data: programData },
    { data: topVideosData },
    { data: topViewedEpisodesData },
    { data: topChannelsData },
  ] = useQueries({
    queries: [
      {
        queryKey: ["program", id, from, to],
        queryFn: () =>
          getYoutubeStats({
            program_id: Number(id),
            from_date: from!,
            to_date: to!,
          }),
      },
      {
        queryKey: ["topVideos"],
        queryFn: getTopVideos,
      },
      {
        queryKey: ["topViewedEpisodes"],
        queryFn: () => getTopViewedEpisodes(Number(id!)),
      },
      {
        queryKey: ["topChannels"],
        queryFn: getTopChannels,
      },
    ],
  });

  console.log(topChannelsData);

  const sortedProgramData = programData
    ?.slice()
    .sort((a: TProgramDetail, b: TProgramDetail) => {
      return (
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });

  // const calculateCumulativeSum = (data: number[]) => {
  //   let cumulativeSum = 0;
  //   return data.map((value) => (cumulativeSum += value));
  // };

  // const cumulativeViews = calculateCumulativeSum(
  //   sortedProgramData?.map((d: TProgramDetail) => d.avg_youtube_views) || []
  // );
  // const cumulativeLikes = calculateCumulativeSum(
  //   sortedProgramData?.map((d: TProgramDetail) => d.avg_youtube_likes) || []
  // );
  // const cumulativeComments = calculateCumulativeSum(
  //   sortedProgramData?.map((d: TProgramDetail) => d.avg_youtube_comments) || []
  // );
  // const cumulativeRate = calculateCumulativeSum(
  //   sortedProgramData?.map((d: TProgramDetail) => d.avg_youtube_rate) || []
  // );

  const lineOptions: Highcharts.Options = {
    title: {
      text: sortedProgramData?.map((d: TProgramDetail) => d.program_name)[0],
    },
    xAxis: {
      categories: sortedProgramData?.map((d: TProgramDetail) => {
        return format(new Date(d.start_time), "yyyy-MM-dd") || [];
      }),
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Views",
        },
        showEmpty: false,
        opposite: false,
        gridLineWidth: 1,
      },
      {
        title: {
          text: "Likes",
        },
        showEmpty: false,
        opposite: true,
        gridLineWidth: 1,
      },
      {
        title: {
          text: "Comments",
        },
        showEmpty: false,
        opposite: true,
        gridLineWidth: 1,
      },
      {
        title: {
          text: "Rate",
        },
        showEmpty: false,
        opposite: true,
        gridLineWidth: 1,
      },
    ],
    series: [
      {
        type: "line",
        data:
          programData?.map((d: TProgramDetail) => d.avg_youtube_views) || [],
        name: "Views",
        yAxis: 0,
      },
      {
        type: "line",
        data:
          programData?.map((d: TProgramDetail) => d.avg_youtube_likes) || [],
        name: "Likes",
        yAxis: 1,
      },
      {
        type: "line",
        data:
          programData?.map((d: TProgramDetail) => d.avg_youtube_comments) || [],
        name: "Comments",
        yAxis: 2,
      },
      {
        type: "line",
        data: programData?.map((d: TProgramDetail) => d.avg_youtube_rate) || [],
        name: "Rate",
        yAxis: 3,
      },
    ],
    tooltip: {
      shared: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
      },
    },
    // responsive: {
    //   rules: [
    //     {
    //       condition: {
    //         // maxWidth: 500,
    //         // minWidth: 800,
    //       },
    //       // chartOptions: {
    //       //   chart: {
    //       //     width: "100%",
    //       //     height: "100%",
    //       //   },
    //       // },
    //     },
    //   ],
    // },
  };

  const barOptions: Highcharts.Options = {
    title: {
      text: "Top viewed episodes",
    },
    xAxis: {
      categories: topViewedEpisodesData?.map((t: TTopVideoProps) => {
        return format(new Date(t.start_time), "yyyy-MM-dd") || [];
      }),
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Views",
        },
        showEmpty: false,
        opposite: false,
      },
    ],
    series: [
      {
        type: "bar",
        data:
          topViewedEpisodesData?.map((d: TTopVideoProps) => d.youtube_views) ||
          [],
        name: "Views",
        yAxis: 0,
      },
    ],
    tooltip: {
      shared: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
      },
    },
    // responsive: {
    //   rules: [
    //     {
    //       condition: {
    //         // maxWidth: 500,
    //         // minWidth: 800,
    //       },
    //       // chartOptions: {
    //       //   chart: {
    //       //     width: null,
    //       //     height: null,
    //       //   },
    //       // },
    //     },
    //   ],
    // },
  };

  return (
    <div className="mt-[84px] lg:mt-[92px] px-[20px] md:px-[40px]">
      <div>
        <h1 className="text-[#0D141C] font-bold text-[32px] leading-[40px] mb-5">
          Detailed analytics
        </h1>
        <div className="flex flex-col lg:flex-row gap-y-10 lg:justify-evenly mt-5">
          <div className="w-full lg:w-[48%] mb-5">
            <HighchartsReact
              highcharts={Highcharts}
              options={lineOptions}
              ref={chartComponentRef}
              {...props}
            />
          </div>
          <div className="w-full lg:w-[48%] mb-5">
            <HighchartsReact
              highcharts={Highcharts}
              options={barOptions}
              ref={chartComponentRef}
              {...props}
            />
          </div>
        </div>
      </div>

      <div className="top-channels-videos-section flex flex-col md:flex-row gap-y-10 md:gap-x-10 mt-5 mb-5">
        <div className="channels-section">
          <h2 className="text-[18px] font-bold leading-[23px] mb-4">
            Channels
          </h2>
          <div className="top-channel-cards flex flex-col gap-y-2">
            {topChannelsData?.map((c: TTopChannel) => (
              <div className="card" key={c.picture_url}>
                <Link to={c.youtube_link} target="_blank">
                  <div
                    className="flex
                   gap-x-3"
                  >
                    <div className="img-container w-[144px] h-[80px]">
                      <img
                        src={c.picture_url}
                        alt="Channel Picture"
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    </div>
                    <div className="">
                      <div className="leading-[24px] font-medium block">
                        {c.stream_name}
                      </div>
                      <div className="flex items-center gap-x-1">
                        <span className="text-[#4D7099] text-[14px]">
                          {/* {c.youtube_subscribers} */}
                          {c.youtube_subscribers > 1000 &&
                          c.youtube_subscribers < 1000000
                            ? `${(c.youtube_subscribers / 1000).toFixed(1)}k`
                            : c.youtube_subscribers > 1000000
                            ? `${(c.youtube_subscribers / 1000000).toFixed(1)}m`
                            : c.youtube_subscribers}{" "}
                          subscribers
                        </span>
                        <span className="text-[#4D7099] text-[14px]">•</span>
                        <span className="text-[#4D7099] text-[14px]">
                          {/* {format(new Date(video.start_time), "yyyy-MM-dd HH:MM")} */}
                          {/* 2.3m views */}
                          {c.video_count} videos
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="top-videos-section">
          <h2 className="text-[18px] font-bold leading-[23px] mb-4">
            Top Videos
          </h2>
          <div className="top-videos-cards flex flex-col gap-y-2">
            {topVideosData?.map((video: TTopVideo) => (
              <div className="card" key={video.youtube_link}>
                <Link to={video.youtube_link} target="_blank">
                  <div className="flex  gap-x-3">
                    <div className="img-container w-[144px] h-[80px] ">
                      <img
                        src={video.picture_path}
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    </div>
                    <div className="">
                      <div className="leading-[24px] font-medium block">
                        {video.youtube_title}
                      </div>
                      <div className="flex items-center gap-x-1">
                        <span className="text-[#4D7099] text-[14px]">
                          {video.youtube_views > 1000
                            ? `${(video.youtube_views / 1000).toFixed(1)}k`
                            : video.youtube_views > 1000000
                            ? `${(video.youtube_views / 1000000).toFixed(1)}m`
                            : video.youtube_views}
                        </span>
                        <span className="text-[#4D7099] text-[14px]">•</span>
                        <span className="text-[#4D7099] text-[14px]">
                          {format(
                            new Date(video.start_time),
                            "yyyy-MM-dd HH:MM"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
