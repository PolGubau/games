import { motion } from "framer-motion";
import React from "react";
import { TbHeartFilled } from "react-icons/tb";

interface HeartNavProps {
  lives?: number;
  maxDegree?: number;
}

const HeartNav: React.FC<HeartNavProps> = ({
  lives = 3,
  maxDegree = 33,
}: HeartNavProps) => {
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
          key={index}
          className="text-red-500"
          whileHover={{
            scale: 1.2,
            rotateZ: Math.random() * (maxDegree - -maxDegree) + -maxDegree,
          }}
        >
          <TbHeartFilled size={35} />
        </motion.span>
      ))}
    </motion.ul>
  );
};

export default HeartNav;
