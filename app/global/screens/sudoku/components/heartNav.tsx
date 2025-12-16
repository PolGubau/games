import { motion } from "motion/react";
import type React from "react";
import { Heart } from "lucide-react";

interface HeartNavProps {
  lives?: number;
  size?: number;
  maxDegree?: number;
}

const HeartNav: React.FC<HeartNavProps> = ({ lives = 3, maxDegree = 33, size = 35 }: HeartNavProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      rotateZ: Math.random() * (maxDegree - -maxDegree) + -maxDegree,
    },
    show: { opacity: 1, rotateZ: 0 },
  };
  return (
    <motion.ul
      className="flex gap-1 items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: lives }, (_, index) => (
        <motion.span
          variants={item}
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="text-red-500"
          whileHover={{
            scale: 1.2,
            rotateZ: Math.random() * (maxDegree - -maxDegree) + -maxDegree,
          }}
        >
          <Heart size={size} fill="currentColor" />
        </motion.span>
      ))}
    </motion.ul>
  );
};

export default HeartNav;
