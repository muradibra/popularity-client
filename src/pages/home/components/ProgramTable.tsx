import { TProgramData } from "../types";
import { Link } from "react-router-dom";

export const ProgramTable = ({
  data,
  timeFrame,
}: {
  data: TProgramData[];
  timeFrame: { from: string; to: string };
}) => {
  console.log("data in ProgramTable", data);

  // const sortedData = data?.slice().sort((a: TProgramData, b: TProgramData) => {
  //   return a?.avg_youtube_rate - b?.avg_youtube_rate;
  // });
  const sortedData =
    data?.sort(
      (a: TProgramData, b: TProgramData) =>
        (b?.avg_youtube_rate ?? 0) - (a?.avg_youtube_rate ?? 0)
    ) || [];
  return (
    <div className="relative overflow-x-auto sm:rounded-lg shadow-md mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              TV Program
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Channel
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Rate
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Views
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Likes
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Comments
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            sortedData?.map((p: TProgramData) => (
              <tr
                key={p.program_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className=" text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Link
                    className="px-6 py-4"
                    to={{
                      pathname: `/program/${p.program_id}`,
                      search: `?from=${timeFrame.from}&to=${timeFrame.to}`,
                    }}
                  >
                    {p.program_name}
                  </Link>
                </th>
                <td className="px-6 py-4 text-center">{p.stream_name}</td>
                <td className="px-6 py-4 text-center">{p.avg_youtube_rate}</td>
                <td className="px-6 py-4 text-center">
                  {p.avg_youtube_views ?? "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {p.avg_youtube_likes ?? "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {p.avg_youtube_comments ?? "-"}
                </td>
                {/* <td className="px-6 py-4 text-center flex items-center justify-center">
                <span>
                  {p.youtube_link
                    ? `${p.youtube_link.substring(0, 30)}...`
                    : "-"}
                </span>
                {p.youtube_link && (
                  <Button
                    onClick={() => copyToClipBoard(p.youtube_link as string)}
                    className="ml-2"
                  >
                    Copy
                  </Button>
                )}
              </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
