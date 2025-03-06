// import { DateTimePicker } from "@/components/ui/dateTimePicker";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DualRangeSliderCustomLabel } from "./components/DualRangeSliderCustomLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { getResults } from "@/services/results";
import { getActiveChannels } from "@/services/channels";
import { TChannel } from "@/types/channels";
import { toast } from "sonner";
import { ProgramTable } from "./components/ProgramTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/shared/Spinner";
import { format } from "date-fns";
import { queryClient } from "@/constants/queryClient";
import { CalendarDatePicker } from "@/components/ui/calendarDatePicker";

const formSchema = z
  .object({
    search: z.string(),
    timeFrame: z.object({
      from: z.string(),
      to: z.string(),
    }),
    channels: z
      .array(z.number())
      .nonempty("At least one channel must be selected"),
    ratings: z.object({
      min: z.number().min(0, "Minimum rating must be at least 0"),
      max: z.number().max(2000, "Maximum rating must be at most 2000"),
    }),
    timeFramePreset: z
      .enum(["seven-days", "thirty-days", "ninety-days", "custom"])
      .optional(),
  })
  .refine(
    (data) => new Date(data.timeFrame.from) <= new Date(data.timeFrame.to),
    {
      message: "From date cannot be greater than To date",
      path: ["timeFrame.from"],
    }
  );

const HomePage = () => {
  const sessValues = JSON.parse(sessionStorage.getItem("val") || "{}");

  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<number[]>([0, 500]);
  const [data, setData] = useState<any>(null);
  const { data: channels, isLoading: isChannelsLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: getActiveChannels,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["getResults"],
    mutationFn: getResults,
    onSuccess: (data) => {
      setData(data);
      queryClient.setQueryData(["getResults"], data);
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while searching for programs");
    },
  });

  const getLocalMidnightDate = (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Ensure it's at local midnight
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { data: cachedResults, isLoading } = useQuery({
    queryKey: ["getResults"],
    queryFn: () => getResults(form.getValues()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    initialData: () => {
      const cachedData = queryClient.getQueryData(["getResults"]);
      return cachedData || null;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: sessValues?.search || "",
      timeFrame: {
        from: sessValues?.timeFrame?.from || getLocalMidnightDate(30),
        to: sessValues?.timeFrame?.to || getLocalMidnightDate(0),
      },
      channels: sessValues?.channels || [],
      ratings: {
        min: Number(sessValues?.ratings?.min) || 0,
        max: Number(sessValues?.ratings?.max) || 500,
      },
      timeFramePreset: sessValues?.timeFramePreset || "thirty-days",
    },
  });

  const { watch, setValue } = form;
  const ratings = watch("ratings");

  const toggleChannelSelection = (channel: number) => {
    const current = form.getValues("channels");
    const updated = current.includes(channel)
      ? current.filter((c) => c !== channel)
      : [channel, ...current];

    setValue("channels", updated as [number, ...number[]]);
  };

  const handleRatingChange = (value: string, isMin: boolean) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      const numValue =
        value === "" ? 0 : Number(value) > 2000 ? 2000 : Number(value);
      if (isMin) {
        setValue("ratings.min", numValue);
        setValues([numValue, ratings.max]);
      } else {
        setValue("ratings.max", numValue);
        setValues([ratings.min, numValue]);
      }
    }
  };

  const setTimeFramePreset = (
    preset: "seven-days" | "thirty-days" | "ninety-days"
  ) => {
    const days =
      preset === "seven-days" ? 7 : preset === "thirty-days" ? 30 : 90;
    const fromDate = getLocalMidnightDate(days);
    const toDate = getLocalMidnightDate();

    form.setValue("timeFramePreset", preset);
    form.setValue("timeFrame.from", fromDate);
    form.setValue("timeFrame.to", toDate);
  };

  useEffect(() => {
    setValues([ratings.min, ratings.max]);
  }, [ratings.min, ratings.max]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
    sessionStorage.setItem("val", JSON.stringify(values));
  }

  return (
    <div className="mt-[65px] px-[20px] md:px-[40px] min-h-screen pb-[30px]">
      <div className="lg:flex">
        <div className="left-section lg:w-[80%]">
          <div className="title">
            <h1 className="text-2xl leading-[40px] mb-4">TV Program Ratings</h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="search-bar relative">
                          <SearchIcon
                            className="absolute top-2 left-2 w-[24px] h-[24px] cursor-pointer"
                            onClick={() => inputRef.current?.focus()}
                          />
                          <Input
                            placeholder="Search..."
                            className="px-9 py-5 bg-[#E8EDF2]"
                            {...field}
                            ref={inputRef}
                          />
                          <XCircleIcon
                            className="absolute top-2 right-2 w-[24px] h-[24px] cursor-pointer"
                            onClick={() => {
                              form.setValue("search", "");
                              inputRef.current?.focus();
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="time-frame-selection mb-[13px] mt-[16px]">
                  <h3 className="text-[#0D141C] text-[18px] font-bold leading-[23px]">
                    Time frame
                  </h3>
                  <FormField
                    control={form.control}
                    name="timeFramePreset"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex flex-wrap items-center gap-5">
                              {[
                                {
                                  id: "seven-days",
                                  label: "Last 7 days",
                                  days: 7,
                                },
                                {
                                  id: "thirty-days",
                                  label: "Last 30 days",
                                  days: 30,
                                },
                                {
                                  id: "ninety-days",
                                  label: "Last 90 days",
                                  days: 90,
                                },
                              ].map(({ id, label }) => (
                                <div
                                  key={id}
                                  className="flex items-center gap-x-2"
                                >
                                  <Input
                                    type="radio"
                                    id={id}
                                    className="w-4 h-4"
                                    checked={field.value === id}
                                    onChange={() => {
                                      setTimeFramePreset(id as any);
                                    }}
                                  />
                                  <Label htmlFor={id}>{label}</Label>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4">
                              <FormLabel className="block mb-4">
                                Custom Range
                              </FormLabel>
                              <div className="mt-2 flex flex-col md:flex-row gap-2 md:gap-x-4">
                                <FormField
                                  control={form.control}
                                  name="timeFrame.from"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>From</FormLabel>
                                      <FormControl>
                                        <CalendarDatePicker
                                          date={{
                                            from: new Date(field.value),
                                            to: new Date(field.value),
                                          }}
                                          onDateSelect={(date) => {
                                            const formattedDate = format(
                                              date.from,
                                              "yyyy-MM-dd"
                                            );

                                            form.setValue(
                                              "timeFrame.from",
                                              formattedDate
                                            );

                                            form.setValue(
                                              "timeFramePreset",
                                              "custom"
                                            );
                                          }}
                                          variant="outline"
                                          numberOfMonths={1}
                                          className="min-w-[250px]"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="timeFrame.to"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>To</FormLabel>
                                      <FormControl>
                                        <CalendarDatePicker
                                          date={{
                                            from: new Date(field.value),
                                            to: new Date(field.value),
                                          }}
                                          onDateSelect={(date) => {
                                            const formattedDate = format(
                                              date.to,
                                              "yyyy-MM-dd"
                                            );

                                            form.setValue(
                                              "timeFrame.to",
                                              formattedDate
                                            );

                                            form.setValue(
                                              "timeFramePreset",
                                              "custom"
                                            );
                                          }}
                                          variant="outline"
                                          numberOfMonths={1}
                                          className="min-w-[250px]"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="channel-selection">
                  <FormField
                    control={form.control}
                    name="channels"
                    render={() => (
                      <FormItem>
                        <h3 className="text-[#0D141C] text-[18px] font-bold leading-[23px]">
                          Channels
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {isChannelsLoading ? (
                            <div className="flex justify-center items-center w-full h-32">
                              <Spinner />
                            </div>
                          ) : (
                            channels?.result?.map((channel: TChannel) => (
                              <div
                                key={channel.stream_id}
                                className={`cursor-pointer py-2 px-4 rounded-lg ${
                                  form
                                    .watch("channels")
                                    .includes(channel.stream_id)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                }`}
                                onClick={() =>
                                  toggleChannelSelection(channel.stream_id)
                                }
                              >
                                {channel.stream_name}
                              </div>
                            ))
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rating-selection">
                  <h3 className="text-[#0D141C] text-[18px] font-bold leading-[23px] mb-10">
                    Ratings
                  </h3>
                  <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:items-center mb-7">
                    <div className="flex gap-x-4">
                      <FormField
                        control={form.control}
                        name="ratings.min"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Minimum Rating"
                                className="w-[70px]"
                                {...field}
                                onChange={(e) =>
                                  handleRatingChange(e.target.value, true)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ratings.max"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Maximum Rating"
                                className="w-[70px]"
                                {...field}
                                onChange={(e) =>
                                  handleRatingChange(e.target.value, false)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full md:w-[55%]">
                      <DualRangeSliderCustomLabel
                        min={0}
                        max={2000}
                        step={10}
                        values={values}
                        setValues={(newValues) => {
                          setValues(newValues);
                          setValue("ratings.min", newValues[0]);
                          setValue("ratings.max", newValues[1]);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Button disabled={isPending} type="submit">
                    Search
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="right-section hidden lg:flex w-[20%]">salam</div>
      </div>

      {cachedResults || data?.length > 0 ? (
        <ProgramTable
          data={cachedResults || data}
          timeFrame={{
            from: form.getValues("timeFrame").from,
            to: form.getValues("timeFrame").to,
          }}
        />
      ) : (
        isLoading ||
        (isPending && (
          <div className="flex justify-center items-center w-full h-32">
            {" "}
            <Spinner />
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
