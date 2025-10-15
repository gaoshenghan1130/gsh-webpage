'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import LeftCircle from '@/components/LeftCircle'
import HomeButton from '@/components/HomeButton'
import dynamic from 'next/dynamic'
import { allDocs } from 'contentlayer/generated'
import { useMDXComponent } from 'pliny/mdx-components'
import pointSys from '@/data/projects/pointSys.json'
import teleop from '@/data/projects/teleop.json'
import udpServer from '@/data/projects/udpServer.json'

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

  const contentMap = [
    {
      title: 'Robotics',
      file: 'data/doc/Robotics/Robotics.mdx',
      intro: `Focused on autonomous robot control and software architecture for RoboCup SSL and MRoboSub. 
    Designed modular systems, finite state machines, and communication protocols to optimize robot behavior.`,
      projects: [pointSys, teleop, udpServer],
    },
    {
      title: 'Software',
      file: 'data/doc/Software/Software.mdx',
      intro: `Experience in software design, architecture, and system integration. Focused on maintainable, modular, 
    and testable systems with CI/CD and CMake.`,
      projects: [pointSys, teleop],
    },
    {
      title: 'Embedded',
      file: 'data/doc/Embedded/Embeded.mdx',
      intro: `Development on STM32, real-time control, and communication systems. Focus on microcontroller applications 
    for unicycles and robotics subsystems.`,
      projects: [pointSys],
    },
    {
      title: 'Web',
      file: 'data/doc/Web/Web.mdx',
      intro: `Building full-stack web applications with focus on backend performance, security, and clean API design.`,
      projects: [pointSys],
    },
    {
      title: 'Game',
      file: 'data/doc/Game/Game.mdx',
      intro: `Designed interactive games featuring unique mechanics and efficient OOP-based engines.`,
      projects: [pointSys, teleop],
    },
  ]

  //const comp = dynamic(() => import(`@/data/doc/Robotics/Robotics.mdx`))
  const doc = allDocs.find((d) => d.title === contentMap[selected].title)
  const code = doc?.body?.code ?? ''

  const MDXContent = useMDXComponent(code)

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
      <HomeButton />
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
          <div
            style={{
              fontSize: '1.2vw',
              lineHeight: '1.8vw',
              opacity: 0.9,
              maxWidth: '50vw',
              marginBottom: '2vh',
            }}
          >
            {doc ? <MDXContent /> : <p>{contentMap[selected].intro}</p>}
          </div>

          {/* 项目卡片 */}
          <div className="flex flex-col gap-4">
            {contentMap[selected].projects.map((p, i) => (
              <motion.a
                key={i}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="rounded-lg border border-gray-700 bg-[#0f0f1a] p-4 text-[#e0e7ff] shadow-md transition-colors duration-300 hover:bg-[#1a1a2d]"
              >
                <h3 className="text-lg font-semibold text-[#f8f9fa]">{p.name}</h3>
                <p className="text-sm opacity-80">{p.desc}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
