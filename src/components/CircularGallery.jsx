import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./CircularGallery.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (from, to, ease) => from + (to - from) * ease;
const modulo = (value, length) => ((value % length) + length) % length;
const wrapOffset = (value, cycle) => modulo(value + cycle / 2, cycle) - cycle / 2;

const CircularGallery = forwardRef(function CircularGallery({
  items = [],
  initialIndex = 0,
  bend = 3,
  scrollSpeed = 2,
  scrollEase = 0.05,
  className = "",
  paused = false,
  renderItem,
  onReady,
  onActiveIndexChange,
}, forwardedRef) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const snapTimerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const wakeAnimationRef = useRef(null);
  const activeIndexRef = useRef(initialIndex);
  const scrollRef = useRef({
    current: 0,
    target: 0,
    cycle: 0,
    step: 1,
    initialized: false,
  });
  const dragRef = useRef({
    active: false,
    moved: false,
    captured: false,
    startX: 0,
    startTarget: 0,
    pointerId: null,
  });

  const getStep = () => {
    const track = trackRef.current;
    const firstItem = track?.querySelector(".circular-gallery__item");
    if (!track || !firstItem) return 1;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return firstItem.offsetWidth + gap;
  };

  const scheduleSnap = () => {
    window.clearTimeout(snapTimerRef.current);
    snapTimerRef.current = window.setTimeout(() => {
      const step = getStep();
      scrollRef.current.target = Math.round(scrollRef.current.target / step) * step;
      wakeAnimationRef.current?.();
    }, 180);
  };

  const moveByItems = (direction) => {
    const step = getStep();
    scrollRef.current.target = Math.round(scrollRef.current.target / step) * step + direction * step;
    wakeAnimationRef.current?.();
  };

  const goToItem = (index) => {
    const { step } = scrollRef.current;
    if (!step || !items.length) return;
    const currentStep = Math.round(scrollRef.current.current / step);
    const currentIndex = modulo(currentStep, items.length);
    let delta = modulo(index - currentIndex, items.length);
    if (delta > items.length / 2) delta -= items.length;
    scrollRef.current.target = currentStep * step + delta * step;
    wakeAnimationRef.current?.();
  };

  useImperativeHandle(forwardedRef, () => ({
    next: () => moveByItems(1),
    previous: () => moveByItems(-1),
    goTo: (index) => goToItem(index),
  }));

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || !items.length) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveEase = reduceMotion ? 1 : scrollEase;
    const effectiveBend = reduceMotion ? 0 : bend;
    let isVisible = false;
    let isPageVisible = !document.hidden;

    const updateBounds = () => {
      const nextStep = getStep();
      const nextCycle = nextStep * items.length;
      const previousStep = scrollRef.current.step;

      if (!scrollRef.current.initialized) {
        scrollRef.current.current = initialIndex * nextStep;
        scrollRef.current.target = initialIndex * nextStep;
        scrollRef.current.initialized = true;
      } else if (Math.abs(previousStep - nextStep) > 0.5) {
        scrollRef.current.current = (scrollRef.current.current / previousStep) * nextStep;
        scrollRef.current.target = (scrollRef.current.target / previousStep) * nextStep;
      }

      scrollRef.current.cycle = nextCycle;
      scrollRef.current.step = nextStep;
    };

    const updateItems = () => {
      const center = container.clientWidth / 2;
      const cards = track.querySelectorAll(".circular-gallery__item");
      let closestIndex = activeIndexRef.current;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const index = Number.parseInt(card.dataset.galleryIndex, 10);
        const offset = wrapOffset(
          index * scrollRef.current.step - scrollRef.current.current,
          scrollRef.current.cycle,
        );
        const normalized = clamp(offset / Math.max(center, 1), -1.35, 1.35);
        const distance = Math.abs(normalized);
        const curve = Math.pow(distance, 1.7) * effectiveBend * 44;
        const rotate = normalized * effectiveBend * 1.7;
        const depth = Math.max(0.9, 1 - distance * 0.055);

        if (Math.abs(offset) < closestDistance) {
          closestDistance = Math.abs(offset);
          closestIndex = index;
        }

        card.style.setProperty("--gallery-x", `${offset - card.offsetWidth / 2}px`);
        card.style.setProperty("--gallery-y", `${curve}px`);
        card.style.setProperty("--gallery-rotate", `${rotate}deg`);
        card.style.setProperty("--gallery-scale", depth.toFixed(3));
        card.style.zIndex = String(Math.max(1, 20 - Math.round(distance * 10)));
      });

      if (Number.isInteger(closestIndex) && closestIndex !== activeIndexRef.current) {
        activeIndexRef.current = closestIndex;
        onActiveIndexChange?.(closestIndex);
      }
    };

    const update = () => {
      animationRef.current = null;
      if (!isVisible || !isPageVisible || paused) return;

      scrollRef.current.current = lerp(
        scrollRef.current.current,
        scrollRef.current.target,
        effectiveEase,
      );
      if (Math.abs(scrollRef.current.target - scrollRef.current.current) < 0.05) {
        scrollRef.current.current = scrollRef.current.target;
      }

      updateItems();
      if (Math.abs(scrollRef.current.target - scrollRef.current.current) >= 0.05 || dragRef.current.moved) {
        animationRef.current = window.requestAnimationFrame(update);
      }
    };

    const startAnimation = () => {
      if (!animationRef.current && isVisible && isPageVisible && !paused) {
        animationRef.current = window.requestAnimationFrame(update);
      }
    };
    wakeAnimationRef.current = startAnimation;

    const stopAnimation = () => {
      if (!animationRef.current) return;
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };

    const onWheel = (event) => {
      if (paused || (Math.abs(event.deltaX) < 1 && Math.abs(event.deltaY) < 1)) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      scrollRef.current.target += delta * scrollSpeed * 0.55;
      startAnimation();
      scheduleSnap();
    };

    const onPointerDown = (event) => {
      if (paused || (event.pointerType === "mouse" && event.button !== 0)) return;
      dragRef.current = {
        active: true,
        moved: false,
        captured: false,
        startX: event.clientX,
        startTarget: scrollRef.current.target,
        pointerId: event.pointerId,
      };
    };

    const onPointerMove = (event) => {
      if (!dragRef.current.active || paused) return;
      const movedBy = Math.abs(event.clientX - dragRef.current.startX);
      const dragThreshold = event.pointerType === "touch" ? 14 : 9;

      if (!dragRef.current.moved && movedBy < dragThreshold) return;
      if (!dragRef.current.moved) {
        dragRef.current.moved = true;
        dragRef.current.captured = true;
        container.setPointerCapture(event.pointerId);
        container.classList.add("is-dragging");
      }

      scrollRef.current.target = dragRef.current.startTarget
        + (dragRef.current.startX - event.clientX) * scrollSpeed;
      startAnimation();
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      const wasDragged = dragRef.current.moved;
      const hadCapture = dragRef.current.captured;

      if (wasDragged) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      dragRef.current.active = false;
      dragRef.current.moved = false;
      dragRef.current.captured = false;
      container.classList.remove("is-dragging");
      if (hadCapture && container.hasPointerCapture(dragRef.current.pointerId)) {
        container.releasePointerCapture(dragRef.current.pointerId);
      }
      if (wasDragged) scheduleSnap();
    };

    const onClickCapture = (event) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    const onKeyDown = (event) => {
      if (paused) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveByItems(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveByItems(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToItem(0);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
      updateItems();
      startAnimation();
    });
    resizeObserver.observe(container);
    resizeObserver.observe(track);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        updateItems();
        startAnimation();
      } else {
        stopAnimation();
      }
    }, { rootMargin: "180px 0px", threshold: 0 });
    visibilityObserver.observe(container);

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) startAnimation();
      else stopAnimation();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    updateBounds();
    updateItems();
    onReady?.();

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("click", onClickCapture, true);
    container.addEventListener("keydown", onKeyDown);

    return () => {
      stopAnimation();
      window.clearTimeout(snapTimerRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      wakeAnimationRef.current = null;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("click", onClickCapture, true);
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [bend, initialIndex, items, onActiveIndexChange, onReady, paused, scrollEase, scrollSpeed]);

  return (
    <div
      ref={containerRef}
      className={`circular-gallery ${className}`.trim()}
      tabIndex="0"
      role="region"
      aria-label="精选项目循环画廊，可拖拽、滚轮或使用左右方向键浏览"
    >
      <div className="circular-gallery__track" ref={trackRef}>
        {items.map((item, index) => (
          <div
            className="circular-gallery__item"
            data-gallery-index={index}
            key={item.id ?? index}
          >
            {renderItem ? renderItem(item, index) : null}
          </div>
        ))}
      </div>
    </div>
  );
});

export default CircularGallery;
