"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Main() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoBright, setVideoBright] = useState(false);
  const [hovering, setHovering] = useState(false);
  const router = useRouter();

  // 视频进度控制主标题亮度
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      if (v.duration && v.currentTime >= v.duration * 0.55)
        setVideoBright(true);
    };

    const onTimeUpdate = () => {
      if (!v.duration) return;
      if (!videoBright && v.currentTime >= v.duration * 0.55)
        setVideoBright(true);
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoBright]);

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      {/* 背景视频 + 可控制 blur */}
      <motion.video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ filter: hovering ? "blur(3px)" : "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <source src="/dynamic/earth_night.mp4" type="video/mp4" />
      </motion.video>

      {/* 页面内容 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center text-6xl leading-tight font-black tracking-tight md:text-8xl"
        >
          {/* 现代厚重开头 */}
          <span
            className="text-7xl text-white/70"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            Hi, I'm
          </span>{" "}
          {/* 优雅衬线名字 */}
          <motion.span
            animate={{ color: videoBright ? "#010b259c" : "#fcd34dc1" }}
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gao Shenghan
          </motion.span>
        </motion.h1>

        {/* 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 1px 2px rgba(255, 255, 255, 0.08)",
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => router.push("/resume")}
            style={{
              willChange: "transform, box-shadow",
              transform: "translateZ(0)",
            }}
            className="mt-10 rounded-full px-[6vw] py-[1vh] text-2xl font-semibold text-white/60 shadow-lg backdrop-blur-sm transition hover:bg-white/10"
            color="rgba(175, 184, 187, 0.32)"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
