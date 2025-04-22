// // src/components/ui/LoadingSpinner.jsx
// export const LoadingSpinner = () => {
//   return (
//     <div className="flex items-center justify-center p-4">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );
// };

// src/components/ui/LoadingSpinner.jsx
import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: { container: "h-6 w-6", dots: "h-1.5 w-1.5" },
    medium: { container: "h-10 w-10", dots: "h-2 w-2" },
    large: { container: "h-16 w-16", dots: "h-3 w-3" },
  };

  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const dotVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Function to create dots with staggered animation delays
  const renderDots = () => {
    const positions = [
      "top-0 left-1/2 -translate-x-1/2", // top
      "top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2", // top-right
      "top-1/2 right-0 -translate-y-1/2", // right
      "bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2", // bottom-right
      "bottom-0 left-1/2 -translate-x-1/2", // bottom
      "bottom-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2", // bottom-left
      "top-1/2 left-0 -translate-y-1/2", // left
      "top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2", // top-left
    ];

    return positions.map((position, index) => (
      <motion.div
        key={index}
        className={`absolute ${position} ${sizes[size].dots} bg-indigo-600 dark:bg-indigo-400 rounded-full`}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{
          delay: index * 0.15, // staggered animation
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    ));
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`relative ${sizes[size].container}`}
        variants={containerVariants}
        animate="animate"
      >
        {renderDots()}
      </motion.div>
    </div>
  );
};
