import { useEffect, useLayoutEffect, useRef } from "react";

let motionRuntimePromise;

const FALLBACK_SELECTORS = [
  ".site-header",
  ".hero-poster",
  ".hero-shade",
  ".hero .hero-type-line",
  ".hero-note",
  ".hero-coordinate",
  ".hero-status",
  ".hero-title-right a",
  ".motion-text__inner",
  ".project-card",
  ".project-media",
  ".project-media img",
  ".capability-card",
  ".profile-showcase > *",
  ".profile-stats > *",
  ".contact-top",
  ".contact > .contact-inner > .eyebrow",
  ".contact-actions",
  ".contact-bottom",
].join(",");

const forcePortfolioVisible = (root) => {
  document.body.classList.remove("motion-enabled", "motion-lock");
  document.body.classList.add("motion-ready");

  const opening = root?.querySelector(".opening-screen");
  if (opening) {
    opening.style.display = "none";
    opening.style.pointerEvents = "none";
  }

  root?.querySelectorAll(FALLBACK_SELECTORS).forEach((element) => {
    ["opacity", "visibility", "transform", "clip-path"].forEach((property) => {
      element.style.removeProperty(property);
    });
  });
};

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
    let fallbackActivated = false;
    const activateFallback = () => {
      fallbackActivated = true;
      forcePortfolioVisible(rootRef.current);
    };
    const safetyTimer = window.setTimeout(() => {
      if (!document.body.classList.contains("motion-ready")) {
        activateFallback();
      }
    }, 4500);

    const recoverPage = () => {
      const openingInterrupted = document.body.classList.contains("motion-enabled")
        && !document.body.classList.contains("motion-ready");
      if (document.visibilityState === "visible" && openingInterrupted) {
        activateFallback();
      }
    };

    loadMotionRuntime().then(({ setupPortfolioMotion }) => {
      if (!active || fallbackActivated || !rootRef.current) return;
      cleanupRef.current = setupPortfolioMotion(rootRef.current);
    }).catch(() => {
      if (active) activateFallback();
      motionRuntimePromise = undefined;
    });

    window.addEventListener("pageshow", recoverPage);
    document.addEventListener("visibilitychange", recoverPage);

    return () => {
      active = false;
      window.clearTimeout(safetyTimer);
      window.removeEventListener("pageshow", recoverPage);
      document.removeEventListener("visibilitychange", recoverPage);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [rootRef]);

  useEffect(() => {
    document.body.classList.toggle("homepage-paused", paused);
    loadMotionRuntime().then(({ setPortfolioMotionPaused }) => {
      setPortfolioMotionPaused(paused);
    }).catch(() => forcePortfolioVisible(rootRef.current));

    return () => {
      document.body.classList.remove("homepage-paused");
    };
  }, [paused]);
}
