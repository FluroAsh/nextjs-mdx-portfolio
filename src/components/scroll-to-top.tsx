import { useWindowScroll } from "react-use";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const ScrollToTop = () => {
  const { y: scrollY } = useWindowScroll();

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  const MIN_HEIGHT = 200;
  const isToggledOn = scrollY > MIN_HEIGHT;

  return (
    <div
      className={cn(
        isToggledOn ? "opacity-100" : "opacity-0 pointer-events-none",
        "fixed bottom-4 right-4 overflow-visible transition-opacity duration-300",
      )}
    >
      <button
        className="shadow-sm rounded-full scale-125 relative p-3.5"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="flex items-center justify-center absolute inset-0 bg-neutral-900 z-10 rounded-full transform scale-110">
          <ArrowUp className="" size={14} />
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-full -z-10 transform transition duration-300",
            "animate-rotate-conic-border",
          )}
          style={{
            background:
              "conic-gradient(from 0deg, #00B846, #005722, #006927, #00B846)",
          }}
        />
      </button>
    </div>
  );
};
