import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "./CircularGallery.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (from, to, ease) => from + (to - from) * ease;

const CircularGallery = forwardRef(function CircularGallery({
  items = [],
  bend = 3,
  scrollSpeed = 2,
  scrollEase = 0.05,
  className = "",
  renderItem,
}, forwardedRef) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const snapTimerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const scrollRef = useRef({ current: 0, target: 0, cycle: 0, step: 1 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startTarget: 0, pointerId: null });

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
    }, 180);
  };

  const moveByItems = (direction) => {
    const step = getStep();
    scrollRef.current.target = Math.round(scrollRef.current.current / step) * step + direction * step;
  };

  useImperativeHandle(forwardedRef, () => ({
    next: () => moveByItems(1),
    previous: () => moveByItems(-1),
  }));

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveEase = reduceMotion ? 1 : scrollEase;
    const effectiveBend = reduceMotion ? 0 : bend;

    const updateBounds = () => {
      const nextStep = getStep();
      const nextCycle = nextStep * items.length;
      const previousCycle = scrollRef.current.cycle;
      const previousStep = scrollRef.current.step;

      if (!previousCycle) {
        scrollRef.current.current = nextCycle;
        scrollRef.current.target = nextCycle;
      } else if (Math.abs(previousCycle - nextCycle) > 0.5) {
        const currentOffset = (scrollRef.current.current - previousCycle) / previousStep;
        const targetOffset = (scrollRef.current.target - previousCycle) / previousStep;
        scrollRef.current.current = nextCycle + currentOffset * nextStep;
        scrollRef.current.target = nextCycle + targetOffset * nextStep;
      }

      scrollRef.current.cycle = nextCycle;
      scrollRef.current.step = nextStep;
    };

    const normalizeLoop = () => {
      const cycle = scrollRef.current.cycle;
      if (!cycle) return;

      while (scrollRef.current.current >= cycle * 1.5) {
        scrollRef.current.current -= cycle;
        scrollRef.current.target -= cycle;
      }

      while (scrollRef.current.current < cycle * 0.5) {
        scrollRef.current.current += cycle;
        scrollRef.current.target += cycle;
      }
    };

    const updateItems = () => {
      const center = container.clientWidth / 2;
      const cards = track.querySelectorAll(".circular-gallery__item");

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 - scrollRef.current.current;
        const normalized = clamp((cardCenter - center) / center, -1.35, 1.35);
        const distance = Math.abs(normalized);
        const curve = Math.pow(distance, 1.7) * effectiveBend * 44;
        const rotate = normalized * effectiveBend * 1.7;
        const depth = Math.max(0.9, 1 - distance * 0.055);

        card.style.setProperty("--gallery-y", `${curve}px`);
        card.style.setProperty("--gallery-rotate", `${rotate}deg`);
        card.style.setProperty("--gallery-scale", depth.toFixed(3));
        card.style.zIndex = String(Math.max(1, 20 - Math.round(distance * 10)));
      });
    };

    const update = () => {
      scrollRef.current.current = lerp(scrollRef.current.current, scrollRef.current.target, effectiveEase);
      if (Math.abs(scrollRef.current.target - scrollRef.current.current) < 0.05) {
        scrollRef.current.current = scrollRef.current.target;
      }
      normalizeLoop();
      track.style.transform = `translate3d(${-scrollRef.current.current}px, 0, 0)`;
      updateItems();
      animationRef.current = window.requestAnimationFrame(update);
    };

    const onWheel = (event) => {
      if (Math.abs(event.deltaX) < 1 && Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      scrollRef.current.target += delta * scrollSpeed * 0.55;
      scheduleSnap();
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragRef.current = {
        active: true,
        moved: false,
        startX: event.clientX,
        startTarget: scrollRef.current.target,
        pointerId: event.pointerId,
      };
      container.setPointerCapture(event.pointerId);
      container.classList.add("is-dragging");
    };

    const onPointerMove = (event) => {
      if (!dragRef.current.active) return;
      const distance = (dragRef.current.startX - event.clientX) * scrollSpeed;
      if (Math.abs(event.clientX - dragRef.current.startX) > 7) {
        dragRef.current.moved = true;
      }
      scrollRef.current.target = dragRef.current.startTarget + distance;
    };

    const onPointerUp = () => {
      if (!dragRef.current.active) return;
      if (dragRef.current.moved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      dragRef.current.active = false;
      container.classList.remove("is-dragging");
      if (container.hasPointerCapture(dragRef.current.pointerId)) {
        container.releasePointerCapture(dragRef.current.pointerId);
      }
      scheduleSnap();
    };

    const onClickCapture = (event) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveByItems(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveByItems(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollRef.current.target = scrollRef.current.cycle;
      }
    };

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(container);
    resizeObserver.observe(track);
    updateBounds();
    update();

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("click", onClickCapture, true);
    container.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      window.clearTimeout(snapTimerRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("click", onClickCapture, true);
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [bend, items, scrollEase, scrollSpeed]);

  return (
    <div
      ref={containerRef}
      className={`circular-gallery ${className}`.trim()}
      tabIndex="0"
      role="region"
      aria-label="精选项目循环画廊，可拖拽、滚轮或使用左右方向键浏览"
    >
      <div className="circular-gallery__track" ref={trackRef}>
        {[0, 1, 2].flatMap((copy) => items.map((item, index) => (
          <div
            className="circular-gallery__item"
            data-gallery-copy={copy}
            aria-hidden={copy === 1 ? undefined : "true"}
            inert={copy === 1 ? undefined : true}
            key={`${copy}-${item.id ?? index}`}
          >
            {renderItem ? renderItem(item, index) : null}
          </div>
        )))}
      </div>
    </div>
  );
});

export default CircularGallery;
