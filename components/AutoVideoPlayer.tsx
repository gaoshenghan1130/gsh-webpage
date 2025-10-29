"use client";
import { useEffect, useRef } from "react";

export default function AutoPlayVideo({ src, width = "100%", ...props }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {}); // 某些浏览器需要静音才能自动播放
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }, // 超过一半视频出现在视口中才触发
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      width={width}
      src={src}
      muted
      playsInline
      preload="none"
      controls
      className="my-4 mx-auto rounded-2xl shadow-lg"
      {...props}
    />
  );
}
