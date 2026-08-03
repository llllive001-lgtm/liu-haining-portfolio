import { useEffect, useLayoutEffect, useRef } from "react";

let motionRuntimePromise;

const loadMotionRuntime = () => {
  if (!motionRuntimePromise) {
    motionRuntimePromise = import("./portfolioMotionRuntime");
  }
  return motionRuntimePromise;
};

export default function usePortfolioMotion(rootRef, paused = false) {
  const cleanupRef = useRef(null);

  useLayoutEffect(() => {
    let active = true;

    loadMotionRuntime().then(({ setupPortfolioMotion }) => {
      if (!active || !rootRef.current) return;
      cleanupRef.current = setupPortfolioMotion(rootRef.current);
    });

    return () => {
      active = false;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [rootRef]);

  useEffect(() => {
    document.body.classList.toggle("homepage-paused", paused);
    loadMotionRuntime().then(({ setPortfolioMotionPaused }) => {
      setPortfolioMotionPaused(paused);
    });

    return () => {
      document.body.classList.remove("homepage-paused");
    };
  }, [paused]);
}
