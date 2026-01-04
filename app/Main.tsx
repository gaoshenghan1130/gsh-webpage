"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FluidBackground from "../components/FluidBackground";

export default function Main() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoBright, setVideoBright] = useState(false);
  const [hovering, setHovering] = useState(false);
  const router = useRouter();

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
      {/* ---------------- 流体背景 ---------------- */}
      <FluidBackground />

      {/* ---------------- 视频背景 ---------------- */}
      <motion.video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-10"
        animate={{
          filter: hovering ? "blur(3px)" : "blur(0px)",
          opacity: 0.93,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <source src="/dynamic/earth_night.mp4" type="video/mp4" />
      </motion.video>

      {/* ---------------- 页面内容 ---------------- */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center text-6xl leading-tight font-black tracking-tight md:text-8xl"
        >
          <span
            className="text-7xl text-white/70"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            Hi, I'm
          </span>{" "}
          <motion.span
            animate={{ color: videoBright ? "#010b259c" : "#fcd34dc1" }}
            transition={{ duration: 1 }}
            className="playfair-font"
          >
            Gao Shenghan
          </motion.span>
        </motion.h1>

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
            style={
              {
                transform: "translateZ(0)",
                willChange: "transform, box-shadow",
              } as React.CSSProperties
            }
            className="mt-10 rounded-full px-[6vw] py-[1vh] text-2xl font-semibold text-white/60 shadow-lg backdrop-blur-sm transition hover:bg-white/10"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
