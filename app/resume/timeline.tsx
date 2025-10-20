"use client";

import { motion, vh } from "framer-motion";
import { useRef, useState } from "react";
import { events } from "./events";

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const middleLineTop = "10vh"; // 1/6，高度节点对齐

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full cursor-grab overflow-x-auto whitespace-nowrap active:cursor-grabbing"
    >
      {/* 分割线：timeline和下方面板 */}
      {/* <div
        className="absolute left-0 h-[2px] w-screen bg-[#0B3985]"
        style={{ top: dividerLineTop }}
      /> */}

      {/* 中间线：节点对齐 */}
      <div
        className="absolute left-0 h-[2px] w-[200vw] bg-gray-300"
        style={{ top: middleLineTop }}
      />

      <motion.div
        className="inline-flex space-x-24 px-20"
        animate={{
          x:
            hoveredIndex === 0
              ? 100
              : hoveredIndex === events.length - 1
                ? -100
                : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {events.map((event, index) => {
          let offset = 0;
          if (hoveredIndex !== null) {
            const distance = Math.abs(index - hoveredIndex);
            if (distance === 1) offset = index < hoveredIndex ? -60 : 60;
            if (distance === 2) offset = index < hoveredIndex ? -30 : 30;
          }

          return (
            <motion.div
              key={index}
              className="group relative flex flex-col items-center z-[9000]"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 70, damping: 22 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              animate={{ x: offset }}
            >
              {/* 节点圆点 */}
              <motion.div
                className="x-[-2px] relative z-10 h-4 w-4 rounded-full bg-gray-400 shadow-md group-hover:bg-blue-500"
                whileHover={{
                  scale: 1.6,
                  boxShadow: "0 0 12px rgba(40, 101, 198, 1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ top: `calc(${middleLineTop} - 8px)` }}
              />

              {/* 年份 */}
              <motion.div
                className="mt-2 text-lg font-semibold text-gray-700"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                style={{ position: "relative", top: middleLineTop }}
              >
                {event.year}
              </motion.div>

              {/* 简要描述 */}
              <div
                className="mt-1 max-w-[150px] text-center text-sm text-gray-500 opacity-100 transition-opacity duration-200 group-hover:opacity-0"
                style={{ position: "relative", top: middleLineTop }}
              >
                {event.desc}
              </div>

              {/* 详细描述框 */}
              <motion.div
                className="absolute mt-3 min-h-[8rem] w-60 rounded-xl border border-gray-200 bg-white/90 px-4 py-2 text-sm break-words whitespace-normal text-gray-800 opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-300"
                style={{
                  pointerEvents: hoveredIndex === index ? "auto" : "none",
                  top: `calc(${middleLineTop} + 2rem)`,
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : -20,
                }}
                transition={{ duration: 0.3 }}
              >
                {event.detail}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
