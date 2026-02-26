import React from 'react';
import { motion } from 'framer-motion';

// Micro-interaction components for small, delightful animations

// Hover pulse effect for buttons and interactive elements
export const HoverPulse = ({ children, className = "", ...props }) => (
  <motion.div
    className={className}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Click ripple effect for buttons
export const ClickRipple = ({ children, className = "", ...props }) => (
  <motion.div
    className={className}
    whileTap={{ 
      scale: 0.98,
      transition: { duration: 0.1 }
    }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Subtle floating animation for decorative elements
export const FloatingElement = ({ children, delay = 0, ...props }) => (
  <motion.div
    animate={{ 
      y: [-5, 5, -5],
      rotate: [-1, 1, -1]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Loading spinner with smooth rotation
export const LoadingSpinner = ({ size = 20, className = "", ...props }) => (
  <motion.div
    className={`inline-block ${className}`}
    animate={{ rotate: 360 }}
    transition={{
      loop: Infinity,
      ease: "linear",
      duration: 1
    }}
    {...props}
  >
    <div 
      className="border-2 border-gray-300 border-t-blue-600 rounded-full"
      style={{ width: size, height: size }}
    />
  </motion.div>
);

// Success checkmark animation
export const SuccessCheckmark = ({ size = 24, className = "", ...props }) => (
  <motion.svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <motion.path
      d="M5 12l5 5L20 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Error cross animation
export const ErrorCross = ({ size = 24, className = "", ...props }) => (
  <motion.svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <motion.path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Notification badge with pulse
export const NotificationBadge = ({ count, className = "", ...props }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
    {...props}
  >
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {count}
    </span>
  </motion.div>
);

// Tooltip with fade-in animation
export const Tooltip = ({ children, content, position = "top", className = "", ...props }) => {
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      {...props}
    >
      {children}
      <motion.div
        className={`absolute ${positionClasses[position]} bg-gray-900 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
        <motion.div
          className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        />
      </motion.div>
    </motion.div>
  );
};

// Progress bar with smooth animation
export const ProgressBar = ({ progress = 0, className = "", ...props }) => (
  <motion.div
    className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
    {...props}
  >
    <motion.div
      className="h-full bg-blue-600 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </motion.div>
);

// Card flip animation
export const CardFlip = ({ children, isFlipped = false, className = "", ...props }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    style={{ transformStyle: "preserve-3d" }}
    {...props}
  >
    <div className="absolute inset-0 backface-hidden">
      {children[0] || children}
    </div>
    <div 
      className="absolute inset-0 backface-hidden" 
      style={{ transform: "rotateY(180deg)" }}
    >
      {children[1]}
    </div>
  </motion.div>
);

// Staggered reveal for lists
export const StaggeredList = ({ children, className = "", ...props }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggeredItem = ({ children, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Bounce in animation for new elements
export const BounceIn = ({ children, delay = 0, className = "", ...props }) => (
  <motion.div
    className={className}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ 
      type: "spring", 
      stiffness: 200, 
      damping: 15,
      delay 
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Shake animation for errors
export const Shake = ({ children, trigger = false, className = "", ...props }) => (
  <motion.div
    className={className}
    animate={trigger ? { 
      x: [-5, 5, -5, 5, 0] 
    } : {}}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Glowing effect for important elements
export const GlowEffect = ({ children, color = "blue", className = "", ...props }) => (
  <motion.div
    className={className}
    whileHover={{ 
      boxShadow: `0 0 20px rgba(var(--${color}-rgb), 0.5)`,
      scale: 1.02
    }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Draggable element with constraints
export const Draggable = ({ children, constraints, className = "", ...props }) => (
  <motion.div
    className={className}
    drag
    dragConstraints={constraints}
    dragElastic={0.2}
    whileDrag={{ cursor: "grabbing" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Scroll reveal animation
export const ScrollReveal = ({ children, threshold = 0.3, className = "", ...props }) => {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Custom hook for creating micro-interactions
export const useMicroInteraction = (type = "hover", options = {}) => {
  const baseOptions = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    pulse: { scale: [1, 1.1, 1] },
    float: { y: [-5, 5, -5] }
  };

  const variants = {
    whileHover: type === "hover" ? baseOptions.hover : {},
    whileTap: type === "tap" ? baseOptions.tap : {},
    animate: type === "pulse" || type === "float" ? baseOptions[type] : {}
  };

  const transition = {
    type: "spring",
    stiffness: 400,
    damping: 17,
    ...options
  };

  return { variants, transition };
};

export default {
  HoverPulse,
  ClickRipple,
  FloatingElement,
  LoadingSpinner,
  SuccessCheckmark,
  ErrorCross,
  NotificationBadge,
  Tooltip,
  ProgressBar,
  CardFlip,
  StaggeredList,
  StaggeredItem,
  BounceIn,
  Shake,
  GlowEffect,
  Draggable,
  ScrollReveal,
  useMicroInteraction
};