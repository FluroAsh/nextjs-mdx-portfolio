import { cn } from "@/utils/misc";

export const ImageCaption = ({
  children,
  isFixed = false,
  styles,
}: {
  children: React.ReactNode;
  isFixed?: boolean;
  styles?: string;
}) => {
  const className = cn(
    isFixed
      ? "absolute bottom-0 left-0 w-full translate-y-1/2 rounded-b-md"
      : "",
    styles,
  );

  return (
    <figcaption
      className={cn(
        "bg-gradient-to-t from-neutral-900 to-neutral-800 px-2 py-1 text-center text-xs text-neutral-400 italic",
        className,
      )}
    >
      {children}
    </figcaption>
  );

  // return (
  //   <figcaption
  //     className={cn(
  //       "px-2 py-1 text-center text-xs text-neutral-50 italic",
  //       "bg-black/30 backdrop-blur-sm",
  //       "shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
  //       className,
  //     )}
  //   >
  //     <span
  //       className="block"
  //       style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
  //     >
  //       {children}
  //     </span>
  //   </figcaption>
  // );
};
