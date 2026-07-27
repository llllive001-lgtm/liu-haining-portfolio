import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./CountUp.css";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  padStart = 0,
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  const startedRef = useRef(false);
  const tweenRef = useRef(null);
  const delayedCallRef = useRef(null);

  const initialValue = direction === "down" ? to : from;
  const targetValue = direction === "down" ? from : to;

  const maxDecimals = useMemo(() => {
    const getDecimalPlaces = (value) => {
      const [, decimals = ""] = String(value).split(".");
      return Number(decimals) === 0 ? 0 : decimals.length;
    };

    return Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
  }, [from, to]);

  const formatValue = useCallback((latest) => {
    const formatted = Intl.NumberFormat("en-US", {
      useGrouping: Boolean(separator),
      minimumFractionDigits: maxDecimals,
      maximumFractionDigits: maxDecimals,
    }).format(latest);
    const separated = separator ? formatted.replace(/,/g, separator) : formatted;
    return maxDecimals === 0 && padStart > 0 ? separated.padStart(padStart, "0") : separated;
  }, [maxDecimals, padStart, separator]);

  useEffect(() => {
    if (!ref.current) return undefined;
    startedRef.current = false;
    ref.current.textContent = formatValue(initialValue);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startAnimation = () => {
      if (startedRef.current || !startWhen || !ref.current) return;
      startedRef.current = true;
      onStart?.();

      if (reduceMotion) {
        ref.current.textContent = formatValue(targetValue);
        onEnd?.();
        return;
      }

      const counter = { value: initialValue };
      delayedCallRef.current = gsap.delayedCall(delay, () => {
        tweenRef.current = gsap.to(counter, {
          value: targetValue,
          duration,
          ease: "power1.out",
          onUpdate: () => {
            if (ref.current) ref.current.textContent = formatValue(counter.value);
          },
          onComplete: () => {
            if (ref.current) ref.current.textContent = formatValue(targetValue);
            onEnd?.();
          },
        });
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startAnimation();
        observer.disconnect();
      }
    }, { threshold: 0.24 });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      delayedCallRef.current?.kill();
      tweenRef.current?.kill();
    };
  }, [delay, duration, formatValue, initialValue, onEnd, onStart, startWhen, targetValue]);

  return <span className={`count-up-text ${className}`.trim()} ref={ref} />;
}
