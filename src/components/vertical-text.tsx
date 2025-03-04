import { cn } from "@/utils/misc";
import { motion as m, MotionProps } from "motion/react";

type Props = {
  text: string;
  className?: string;
  charProps?: MotionProps;
  // stagger?: {
  //   amount: number;
  // };
  containerProps: MotionProps;
} & MotionProps;

export const VerticalText = ({
  text,
  className,
  containerProps,
  // stagger,
  charProps,
}: Props) => {
  return (
    <m.div
      className={cn("select-none", className)}
      style={{ writingMode: "vertical-rl" }}
      {...containerProps}
    >
      {[...text].map((char, idx) => {
        // TODO: Fix the stagger logic charProps
        // if (charProps && stagger) {
        //   charProps["transition"] = {
        //     ...charProps["transition"],
        //     delay: (charProps.transition?.delay || 0) + idx * stagger.amount,
        //   };
        // }

        // console.log(JSON.stringify(charProps, null, 2));

        return (
          <m.span
            key={idx}
            className="text-green-500/70 font-bold"
            {...charProps}
          >
            {char}
          </m.span>
        );
      })}
    </m.div>
  );
};
