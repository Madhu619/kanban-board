import { useEffect, useRef } from "react";

/**
 * Custom hook for polling a callback at a given interval (ms).
 * Returns nothing, just runs the callback on interval.
 *
 * @param callback - The function to be called at each interval.
 * @param interval - The interval in milliseconds at which to call the callback.
 * @param deps - Optional dependencies array to control when the polling starts/stops.
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

export function usePolling(
  callback: () => void,
  interval: number,
  deps: any[] = []
) {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callback();
    pollingRef.current = setInterval(callback, interval);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
