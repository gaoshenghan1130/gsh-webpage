'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import LeftCircle from '@/components/LeftCircle'

const entries = [
  'Robotics',
  'Software Engineering',
  'Embedded Systems',
  'Web Development & Cybersecurity',
  'Game Design & Software structures',
]

export default function DocumentPage() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [boxPos, setBoxPos] = useState({ top: 0, height: 0 })

  const itemRefs = useRef<HTMLLIElement[]>([])

  // 更新背景框位置
  useEffect(() => {
    const idx = hovered ?? selected
    const el = itemRefs.current[idx]
    if (el) {
      const rect = el.getBoundingClientRect()
      setBoxPos({ top: el.offsetTop, height: rect.height })
    }
  }, [hovered, selected])

  return (
    <div
      className="relative flex h-screen w-screen"
      style={{
        background: 'linear-gradient(90deg, #050816 0%, #0a0c1d 40%, #1a103d 100%)',
      }}
    >
      {/* 背景光晕 */}
      <div className="absolute inset-0 top-0 right-0 h-full w-[30vw] bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.25),transparent_60%)]" />
      <div className="absolute inset-0 top-0 right-0 h-full w-[30vw] bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.15),transparent_60%)]" />

      {/* 左侧导航 */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: '30vw',
          backgroundColor: '#020212', // 更深的黑
        }}
      >
        {/* 半圆装饰 */}
        <div className="absolute inset-0 opacity-40">
          <LeftCircle />
        </div>

        {/* 条目列表 */}
        <ul
          className="relative z-10 flex flex-col justify-around"
          style={{
            height: '60vh',
            paddingLeft: '7vw',
          }}
        >
          {/* 背景滑动框 */}
          <motion.div
            className="absolute left-0 w-full rounded-md"
            style={{
              top: boxPos.top,
              left: '5vw',
              height: boxPos.height,
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
              opacity: 0.25,
            }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {entries.map((entry, idx) => (
            <motion.li
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el!
              }}
              style={{
                marginBottom: idx === entries.length - 1 ? 0 : '1.8vh',
                paddingTop: '1.2vh',
                paddingBottom: '1.2vh',
                cursor: 'pointer',
                fontSize: '1.6vw',
                position: 'relative',
              }}
              className={`relative cursor-pointer font-medium transition-colors duration-300 ${
                selected === idx
                  ? 'text-[#fffbe8]' // 暖白
                  : 'text-gray-300 hover:text-[#f4e3b2]' // hover 变成柔黄色
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(idx)}
            >
              {entry}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* 右侧内容区 */}
      <div
        className="flex flex-col justify-start p-[4vw]"
        style={{
          width: '70vw',
          color: '#E0E7FF',
        }}
      >
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="mb-[1.5vh] bg-clip-text font-bold text-transparent"
            style={{
              fontSize: '2.6vw',
              color: '#fffbe8', // ✅ 改成暖白
              textShadow: '2px 2px 6px rgba(255, 240, 180, 0.3)',
              maxWidth: '70vw',
            }}
          >
            {entries[selected]}
          </h2>
          <p
            style={{
              fontSize: '1.2vw',
              lineHeight: '1.8vw',
              opacity: 0.9,
              maxWidth: '50vw',
            }}
          >
            这里是 {entries[selected]} 的详细内容区域。你可以展示代码、图片、或其他交互组件。
          </p>
        </motion.div>
      </div>
    </div>
  )
}
