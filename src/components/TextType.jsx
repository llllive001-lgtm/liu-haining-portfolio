import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./TextType.css";

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const containerRef = useRef(null);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
  }, [variableSpeed, typingSpeed]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedText(reverseMode ? textArray[0].split("").reverse().join("") : textArray[0]);
      setCurrentCharIndex(textArray[0].length);
      setIsVisible(true);
      return undefined;
    }
    if (!startOnVisible || !containerRef.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [reverseMode, startOnVisible, textArray]);

  useEffect(() => {
    if (!isVisible) return undefined;
    let timeout;
    const currentText = textArray[currentTextIndex] ?? "";
    const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;

    if (isDeleting) {
      if (displayedText === "") {
        setIsDeleting(false);
        onSentenceComplete?.(currentText, currentTextIndex);
        if (currentTextIndex === textArray.length - 1 && !loop) return undefined;
        setCurrentTextIndex((previous) => (previous + 1) % textArray.length);
        setCurrentCharIndex(0);
      } else {
        timeout = window.setTimeout(() => setDisplayedText((previous) => previous.slice(0, -1)), deletingSpeed);
      }
    } else if (currentCharIndex < processedText.length) {
      timeout = window.setTimeout(() => {
        setDisplayedText((previous) => previous + processedText[currentCharIndex]);
        setCurrentCharIndex((previous) => previous + 1);
      }, currentCharIndex === 0 ? initialDelay : getRandomSpeed());
    } else if (loop || currentTextIndex < textArray.length - 1) {
      timeout = window.setTimeout(() => setIsDeleting(true), pauseDuration);
    }

    return () => window.clearTimeout(timeout);
  }, [currentCharIndex, currentTextIndex, deletingSpeed, displayedText, getRandomSpeed, initialDelay, isDeleting, isVisible, loop, onSentenceComplete, pauseDuration, reverseMode, textArray]);

  const currentText = textArray[currentTextIndex] ?? "";
  const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;
  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < processedText.length || isDeleting);
  const currentColor = textColors.length ? textColors[currentTextIndex % textColors.length] : "inherit";

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`.trim(),
      "aria-label": props["aria-label"] || processedText,
      ...props,
    },
    <span className="text-type__measure" aria-hidden="true">{processedText}</span>,
    <span className="text-type__content" aria-hidden="true" style={{ color: currentColor }}>{displayedText}</span>,
    showCursor && (
      <span
        aria-hidden="true"
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? "text-type__cursor--hidden" : ""}`.trim()}
        style={{ "--cursor-blink-duration": `${cursorBlinkDuration}s` }}
      >
        {cursorCharacter}
      </span>
    ),
  );
};

export default TextType;
