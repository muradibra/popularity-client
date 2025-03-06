import { DualRangeSlider } from "@/components/ui/dualRangeSlider";
// import { DualRangeSlider } from "@/components/ui/DualSlider";
// import { usePathname, useRouter } from "next/navigation";

interface Props {
  min: number;
  max: number;
  step: number;
  values: number[];
  setValues: (values: number[]) => void;
}

export const DualRangeSliderCustomLabel = ({
  min,
  max,
  step,
  values,
  setValues,
}: Props) => {
  // const [values, setValues] = useState([min, max]) || [0, 1000000];
  // const pathname = usePathname();
  // const router = useRouter();

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  // useEffect(() => {
  //   if (!values) return;
  //   const searchParams = new URLSearchParams(window.location.search);
  //   searchParams.set(
  //     "price",
  //     values[0]?.toString() + "-" + values[1]?.toString()
  //   );

  //   const searchParamsStr = searchParams.toString();
  //   router.push(${pathname}?${searchParamsStr});
  // }, [values]);

  return (
    <div className="w-full space-y-5 ">
      <DualRangeSlider
        label={(value) => <span>{value}</span>}
        value={values}
        onValueChange={setValues}
        min={min}
        max={max}
        step={step}
        className="text-sm"
      />
    </div>
  );
};
