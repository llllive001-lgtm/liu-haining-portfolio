import { memo, useMemo, useRef } from "react";
import "./GradualBlur.css";

const curves = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - (1 - progress) ** 2,
  "ease-in-out": (progress) => (
    progress < 0.5
      ? 2 * progress * progress
      : 1 - ((-2 * progress + 2) ** 2) / 2
  ),
};

const gradientDirection = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  curve = "linear",
  opacity = 1,
  duration = "0.3s",
  easing = "ease-out",
  target = "parent",
  zIndex = 1000,
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);

  const blurLayers = useMemo(() => {
    const increment = 100 / divCount;
    const curveFunction = curves[curve] || curves.linear;

    return Array.from({ length: divCount }, (_, layerIndex) => {
      const index = layerIndex + 1;
      const progress = curveFunction(index / divCount);
      const blurValue = exponential
        ? 2 ** (progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;
      const start = Math.round((increment * index - increment) * 10) / 10;
      const solidStart = Math.round(increment * index * 10) / 10;
      const solidEnd = Math.round((increment * index + increment) * 10) / 10;
      const end = Math.round((increment * index + increment * 2) * 10) / 10;
      let stops = `transparent ${start}%, black ${solidStart}%`;

      if (solidEnd <= 100) stops += `, black ${solidEnd}%`;
      if (end <= 100) stops += `, transparent ${end}%`;

      const mask = `linear-gradient(${gradientDirection[position] || "to bottom"}, ${stops})`;

      return (
        <span
          className="gradual-blur__layer"
          key={index}
          style={{
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
          }}
        />
      );
    });
  }, [curve, divCount, exponential, opacity, position, strength]);

  const isVertical = position === "top" || position === "bottom";
  const isPageTarget = target === "page";
  const containerStyle = {
    position: isPageTarget ? "fixed" : "absolute",
    height: isVertical ? height : "100%",
    width: isVertical ? width || "100%" : width || height,
    [position]: 0,
    ...(isVertical ? { left: 0, right: 0 } : { top: 0, bottom: 0 }),
    zIndex: isPageTarget ? zIndex + 100 : zIndex,
    transition: `opacity ${duration} ${easing}, visibility ${duration} ${easing}`,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${isPageTarget ? "gradual-blur--page" : "gradual-blur--parent"} ${className}`.trim()}
      style={containerStyle}
      aria-hidden="true"
    >
      {blurLayers}
    </div>
  );
}

export default memo(GradualBlur);
