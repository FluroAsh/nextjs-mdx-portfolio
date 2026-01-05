import { useEffect, useRef, useState } from "react";

type UseIntersectionObserverProps = {
  threshold?: number;
  root?: HTMLElement | null;
  rootMargin?: string;
};

export const UseIntersectionObserver = <T extends HTMLElement>({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
}: UseIntersectionObserverProps = {}) => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && ref.current.nodeType === Node.ELEMENT_NODE) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        { threshold, root, rootMargin },
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }
  }, [ref, threshold, root, rootMargin]);

  return { isIntersecting, ref };
};
