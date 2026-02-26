import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "../store/themeStore";

// Hook for intersection observer animations
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });

  return { ref, isInView };
};

// Hook for staggered animations
export const useStaggerAnimation = (items, delay = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return { containerRef, isVisible };
};

// Hook for hover animations with theme awareness
export const useHoverAnimation = (initialScale = 1, hoverScale = 1.05) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    animate: {
      scale: isHovered ? hoverScale : initialScale,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  return hoverProps;
};

// Hook for click animations
export const useClickAnimation = (tapScale = 0.95) => {
  const [isPressed, setIsPressed] = useState(false);

  const clickProps = {
    whileTap: { scale: tapScale },
    onTapStart: () => setIsPressed(true),
    onTapEnd: () => setIsPressed(false),
  };

  return clickProps;
};

// Hook for loading animations
export const useLoadingAnimation = (duration = 1000) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, duration]);

  return { isLoading, startLoading, stopLoading };
};

// Hook for theme-aware animations
export const useThemeAnimation = (lightVariants, darkVariants) => {
  const { theme } = useTheme();

  return theme === "dark" ? darkVariants : lightVariants;
};

// Hook for responsive animations
export const useResponsiveAnimation = (mobileVariants, desktopVariants) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile ? mobileVariants : desktopVariants;
};

// Hook for sequential animations
export const useSequentialAnimation = (items, delay = 0.2) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef([]);

  const handleItemInView = (index) => {
    setVisibleItems((prev) => new Set([...prev, index]));
  };

  const resetAnimation = () => {
    setVisibleItems(new Set());
  };

  return {
    itemRefs,
    visibleItems,
    handleItemInView,
    resetAnimation,
  };
};

// Hook for parallax animations
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffset(scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
};

// Hook for focus animations
export const useFocusAnimation = () => {
  const [isFocused, setIsFocused] = useState(false);

  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    animate: {
      scale: isFocused ? 1.02 : 1,
      boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return focusProps;
};

// Hook for drag animations
export const useDragAnimation = (constraints = {}) => {
  const dragProps = {
    drag: true,
    dragConstraints: constraints,
    dragElastic: 0.2,
    whileDrag: {
      scale: 1.1,
      zIndex: 10,
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  };

  return dragProps;
};

// Hook for gesture animations
export const useGestureAnimation = () => {
  const [gestureState, setGestureState] = useState({
    isPressed: false,
    isHovered: false,
  });

  const gestureProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    onHoverStart: () =>
      setGestureState((prev) => ({ ...prev, isHovered: true })),
    onHoverEnd: () =>
      setGestureState((prev) => ({ ...prev, isHovered: false })),
    onTapStart: () => setGestureState((prev) => ({ ...prev, isPressed: true })),
    onTapEnd: () => setGestureState((prev) => ({ ...prev, isPressed: false })),
  };

  return { gestureState, gestureProps };
};

// Hook for scroll-triggered animations
export const useScrollTrigger = (triggerPoint = 0.5) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: triggerPoint }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [triggerPoint]);

  return { ref, isVisible };
};

// Hook for theme-aware color animations
export const useThemeColorAnimation = (lightColor, darkColor) => {
  const { theme } = useTheme();

  const colorVariants = {
    initial: { backgroundColor: theme === "dark" ? darkColor : lightColor },
    animate: {
      backgroundColor: theme === "dark" ? lightColor : darkColor,
      transition: { duration: 0.3 },
    },
  };

  return colorVariants;
};

// Hook for text reveal animations
export const useTextReveal = (text, delay = 0) => {
  const [revealedChars, setRevealedChars] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (revealedChars < text.length) {
      intervalRef.current = setInterval(() => {
        setRevealedChars((prev) => prev + 1);
      }, 50 + delay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text.length, revealedChars, delay]);

  return text.slice(0, revealedChars);
};

// Hook for progress animations
export const useProgressAnimation = (targetValue, duration = 1000) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setProgress(progress * targetValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return progress;
};

// Hook for infinite animations
export const useInfiniteAnimation = (animationKeyframes, duration = 2000) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animate = () => {
      setProgress((prev) => (prev + 1) % 100);
    };

    const interval = setInterval(animate, duration / 100);
    return () => clearInterval(interval);
  }, [duration]);

  return progress;
};

// Hook for responsive animation variants
export const useResponsiveVariants = (variants) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile ? variants.mobile : variants.desktop;
};

// Hook for animation state management
export const useAnimationState = (initialState = {}) => {
  const [animationState, setAnimationState] = useState(initialState);

  const updateAnimationState = (updates) => {
    setAnimationState((prev) => ({ ...prev, ...updates }));
  };

  const resetAnimationState = () => {
    setAnimationState(initialState);
  };

  return {
    animationState,
    updateAnimationState,
    resetAnimationState,
  };
};

// Hook for conditional animations
export const useConditionalAnimation = (condition, variants) => {
  const animationProps = condition
    ? { animate: variants.animate }
    : { initial: variants.initial };

  return animationProps;
};

// Hook for animation queue
export const useAnimationQueue = (animations) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAnimation = () => {
    setCurrentIndex((prev) => (prev + 1) % animations.length);
  };

  const resetQueue = () => {
    setCurrentIndex(0);
  };

  return {
    currentAnimation: animations[currentIndex],
    nextAnimation,
    resetQueue,
    currentIndex,
  };
};

// Hook for animation completion callbacks
export const useAnimationComplete = (onComplete) => {
  const handleAnimationComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return { onAnimationComplete: handleAnimationComplete };
};

// Hook for animation debugging
export const useAnimationDebug = (name, variants) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const debugProps = {
    onAnimationStart: () => {
      setIsAnimating(true);
      console.log(`Animation started: ${name}`);
    },
    onAnimationComplete: () => {
      setIsAnimating(false);
      console.log(`Animation completed: ${name}`);
    },
  };

  return { isAnimating, debugProps };
};
