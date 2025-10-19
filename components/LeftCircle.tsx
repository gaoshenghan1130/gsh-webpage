"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function LeftArcDecoration() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [oheight, setHeight] = useState(0);
  const [owidth, setWidth] = useState(0);
  const layerCount = 5;

  const [offsetsX, setOffsetsX] = useState<number[]>(Array(layerCount).fill(0));
  const [offsetsY, setOffsetsY] = useState<number[]>(Array(layerCount).fill(0));
  const [offsetsR, setOffsetsR] = useState<number[]>(Array(layerCount).fill(0));
  const [offsetsH, setOffsetH] = useState<number[]>(Array(layerCount).fill(0));

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const waveX_X = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 20);
  const waveY_X = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 20);
  const waveX_Y = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 50);
  const waveY_Y = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 50);
  const waveX_R = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 20);
  const waveY_R = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 20);
  const waveX_H = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 50);
  const waveY_H = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 50);

  const waveFactorX = useTransform(
    [waveX_X, waveY_X],
    ([wx, wy]: number[]) => wx * 0.3 + wy * 0.7,
  );
  const waveFactorY = useTransform(
    [waveX_Y, waveY_Y],
    ([wx, wy]: number[]) => wx * 0.7 + wy * 0.3,
  );
  const waveFactorR = useTransform(
    [waveX_R, waveY_R],
    ([wx, wy]: number[]) => wx * 0.5 + wy * 0.5,
  );
  const waveFactorH = useTransform(
    [waveX_H, waveY_H],
    ([wx, wy]: number[]) => wx * 0.4 + wy * 0.6,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setOffsetsX(
      Array.from({ length: layerCount }, () => Math.random() * 20 - 10),
    );
    setOffsetsY(
      Array.from({ length: layerCount }, () => Math.random() * 200 - 100),
    );
    setOffsetsR(Array.from({ length: layerCount }, () => Math.random() * 10));
    setOffsetH(
      Array.from({ length: layerCount }, () => Math.random() * 50 - 25),
    );
  }, []);

  const { radius, visibleWidth } = useMemo(() => {
    const height = oheight * 1.5;
    const deg = 20;
    const rad = (deg * Math.PI) / 180;
    const radius = height / (2 * Math.sin(rad / 2));
    const visibleWidth = radius * (1 - Math.cos(rad / 2));
    return { radius, visibleWidth };
  }, [oheight]);

  const [waveWidths, setWaveWidths] = useState<number[]>(
    offsetsR.map((r) => radius + r),
  );
  const [waveHeights, setWaveHeights] = useState<number[]>(
    offsetsH.map((h) => radius + h),
  );
  const [waveX, setWaveX] = useState<number[]>(
    offsetsR.map((r) => -radius + visibleWidth + r),
  );
  const [waveY, setWaveY] = useState<number[]>(offsetsH.map((h) => 50));

  // 初始化波纹
  useEffect(() => {
    if (radius === 0) return;
    const newWidths = offsetsR.map((r) => radius + r);
    setWaveWidths(newWidths);
    const newH = offsetsH.map((h) => h + radius);
    setWaveHeights(newH);
    const newX = offsetsX.map(
      (x, i) => -radius + visibleWidth + x + (i + 1) * 0.03,
    );
    setWaveX(newX);
    const newY = offsetsY.map((y, i) => 50 + y * 0.2);
    setWaveY(newY);
  }, [radius, offsetsR, offsetsH, offsetsX, offsetsY, visibleWidth]);

  // 鼠标移动时更新波纹
  useEffect(() => {
    const handleMouseMove = () => {
      if (radius === 0) return;
      const newX = offsetsX.map(
        (x, i) =>
          -radius + visibleWidth + x + waveFactorX.get() * ((i - 2) / 4) * 0.08,
      );
      setWaveX(newX);
      const newY = offsetsY.map(
        (y, i) => 50 + y * 0.2 + waveFactorY.get() * ((i - 2.5) / 4) * 0.3,
      );
      setWaveY(newY);
      const newWidths = offsetsR.map(
        (r, i) => radius + r + waveFactorR.get() * ((i - 2) / 4) * 0.3,
      );
      setWaveWidths(newWidths);
      const newH = offsetsH.map(
        (h, i) => h + radius + waveFactorH.get() * ((i - 2) / 4) * 0.03,
      );
      setWaveHeights(newH);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    radius,
    offsetsR,
    waveFactorR,
    mouseX,
    mouseY,
    offsetsH,
    waveFactorH,
    offsetsX,
    waveFactorX,
    offsetsY,
    waveFactorY,
    visibleWidth,
  ]);

  if (!mounted || oheight === 0 || owidth === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 z-1000 h-screen w-screen"
      style={{ background: "transparent" }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      {/* 主弓形 */}
      <motion.div
        style={{
          width: `${radius * 1.05}px`,
          height: `${radius * 1.05}px`,
          left: `-${radius - visibleWidth + 10}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        className="pointer-events-auto absolute z-50 flex cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(180deg,#22ffff,#3b82f6,#c084fc)] opacity-40 blur-3xl"
        onClick={() => router.push("/")}
      >
        <span
          className="text-lg font-bold tracking-widest text-white select-none"
          style={{ writingMode: "vertical-rl" }}
        >
          HOME
        </span>
      </motion.div>

      {/* 动态波纹层 */}
      {Array.from({ length: layerCount }, (_, i) => (
        <motion.div
          key={i}
          style={{
            width: waveWidths[i],
            height: waveHeights[i],
            left: `${waveX[i]}px`,
            top: `${waveY[i]}%`,
            transform: "translateY(-50%)",
            opacity: 0.5 - i * 0.08,
          }}
          className="absolute z-10 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500/30"
        />
      ))}
    </div>
  );
}
