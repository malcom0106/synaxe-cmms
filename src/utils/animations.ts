
import { useEffect, useState } from "react";

// Simple fade-in hook for components
export const useFadeIn = (delay = 0, duration = 300) => {
  const [style, setStyle] = useState({
    opacity: 0,
    transform: "translateY(20px)",
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: "translateY(0px)",
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return style;
};

// Staggered animation for lists
export const useStaggeredFadeIn = (itemCount: number, baseDelay = 50, duration = 300) => {
  return (index: number) => ({
    opacity: 0,
    transform: "translateY(10px)",
    animation: `fadeIn ${duration}ms ease-out ${baseDelay * index}ms forwards`,
  });
};

// Pulse animation for notifications or alerts
export const usePulse = (duration = 1500) => {
  return {
    animation: `pulse ${duration}ms cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  };
};

// Smooth scroll to element
export const scrollToElement = (elementId: string, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

// Page transition animation classes
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Hover animation styles
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

// Glass morphism effect
export const glassEffect = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)"
};
