import { useEffect, useState } from "react";

/**
 * For cases where we need to ensure the server and client have the same initial HTML on the first render,
 * until the component has successfully mounted.
 *
 * If you only need to check if the component is mounted, you can use the `useFirstMountState` hook.
 * */
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};
