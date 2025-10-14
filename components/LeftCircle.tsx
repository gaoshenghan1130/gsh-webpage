'use client'

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion'
import { useRef, useEffect, useState, useMemo, use } from 'react'

export default function LeftArcDecoration() {
  const [mounted, setMounted] = useState(false)
  const [oheight, setHeight] = useState(0)
  const [owidth, setWidth] = useState(0)
  const [offsetsX, setOffsetsX] = useState<number[]>(Array(9).fill(0))
  const [offsetsY, setOffsetsY] = useState<number[]>(Array(9).fill(0))
  const [offsetsR, setOffsetsR] = useState<number[]>(Array(9).fill(0))
  const [offsetsH, setOffsetH] = useState<number[]>(Array(9).fill(0))

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const waveX_X = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 20)
  const waveY_X = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 20)
  const waveX_Y = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 50)
  const waveY_Y = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 50)
  const waveX_R = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 20)
  const waveY_R = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 20)
  const waveX_H = useTransform(mouseX, (x) => Math.sin(x * 0.01) * 50)
  const waveY_H = useTransform(mouseY, (y) => Math.cos(y * 0.01) * 50)

  // waveFactor = waveX + waveY
  const waveFactorX = useTransform([waveX_X, waveY_X], ([wx, wy]: number[]) => wx * 0.3 + wy * 0.7)
  const waveFactorY = useTransform([waveX_Y, waveY_Y], ([wx, wy]: number[]) => wx * 0.7 + wy * 0.3)
  const waveFactorR = useTransform([waveX_R, waveY_R], ([wx, wy]: number[]) => wx * 0.5 + wy * 0.5)
  const waveFactorH = useTransform([waveX_H, waveY_H], ([wx, wy]: number[]) => wx * 0.4 + wy * 0.6)

  // 标记已挂载，避免 SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const update = () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    setOffsetsX(Array.from({ length: 9 }, () => Math.random() * 20 - 10))
    setOffsetsY(Array.from({ length: 9 }, () => Math.random() * 50 - 25))
    setOffsetsR(Array.from({ length: 9 }, () => Math.random() * 50 - 25))
    setOffsetH(Array.from({ length: 9 }, () => Math.random() * 100 - 50))
  }, [])

  const { radius, visibleWidth } = useMemo(() => {
    const height = oheight * 1.5
    const deg = 20
    const rad = (deg * Math.PI) / 180
    const radius = height / (2 * Math.sin(rad / 2))
    const visibleWidth = radius * (1 - Math.cos(rad / 2))
    return { radius, visibleWidth }
  }, [oheight, mouseX, mouseY])

  const [waveWidths, setWaveWidths] = useState<number[]>(offsetsR.map((r) => radius + r))
  const [waveHeights, setWaveHeights] = useState<number[]>(offsetsH.map((h) => radius + h))
  const [waveX, setWaveX] = useState<number[]>(offsetsR.map((r) => -radius + visibleWidth + r))
  const [waveY, setWaveY] = useState<number[]>(offsetsH.map((h) => (radius + 50) / 100))

  // 初始化波纹宽度
  useEffect(() => {
    if (radius === 0) return
    const newWidths = offsetsR.map((r, i) => radius + r)
    setWaveWidths(newWidths)
    const newH = offsetsH.map((h, i) => h + radius)
    setWaveHeights(newH)
    const newX = offsetsX.map((x, i) => -radius + visibleWidth + x + (i + 1) * 0.03)
    setWaveX(newX)
    const newY = offsetsY.map((y, i) => y + 50 + (i + 1) * 0.03)
    setWaveY(newY)
  }, [radius, offsetsR])

  // 鼠标移动时更新波纹宽度
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      console.log('handleMouseMove')
      if (radius === 0) return // 等 radius 有值
      console.log('radius', radius)
      const newX = offsetsX.map(
        (x, i) => -radius + visibleWidth + waveFactorX.get() * (i + 1) * 0.03
      )
      setWaveX(newX)
      const newY = offsetsY.map((y, i) => y + 50 + waveFactorY.get() * (i + 1) * 0.03)
      setWaveY(newY)
      const newWidths = offsetsR.map((r, i) => radius + r + waveFactorR.get() * (i + 1) * 0.03)
      setWaveWidths(newWidths)
      const newH = offsetsH.map((h, i) => h + radius + waveFactorH.get() * (i + 1) * 0.03)
      setWaveHeights(newH)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [radius, offsetsR, waveFactorR, mouseX, mouseY])

  if (!mounted || oheight === 0 || owidth === 0) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen"
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
    >
      {/* 主弓形 */}
      <motion.div
        style={{
          width: `${radius}px`,
          height: `${radius}px`,
          left: `-${radius - visibleWidth + 10}px`, // 只露出 visibleWidth
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        className="absolute rounded-full bg-gradient-to-b from-indigo-400 to-blue-500 opacity-90 shadow-2xl"
      />

      {/* 动态波纹层 */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        return (
          <motion.div
            key={i}
            style={{
              width: waveWidths[i - 1],
              height: waveHeights[i - 1],
              left: `${waveX[i - 1]}px`,
              top: `${waveY[i - 1]}%`,
              transform: 'translateY(-50%)',
              opacity: 1 - i * 0.1,
            }}
            className="absolute z-10 rounded-full bg-gradient-to-b from-indigo-400 to-blue-500/30"
          />
        )
      })}
    </div>
  )
}
