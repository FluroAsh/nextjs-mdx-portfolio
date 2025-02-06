import { useWindowScroll } from "react-use";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const ScrollToTop = () => {
  const { y: scrollY } = useWindowScroll();

  // useHasMounted ensures the button is only rendered after client-side hydration, preventing SSR hydration errors.
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
        className="bg-neutral-900 shadow-sm rounded-full p-2 z-10"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp />
        <div className="absolute inset-0 bg-green-600 -z-10 rounded-full transform scale-[110%]" />
      </button>
    </div>
  );
};
