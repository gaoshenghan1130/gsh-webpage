'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LeftCircle from '@/components/LeftCircle'

const entries = ['文档条目 1', '文档条目 2', '文档条目 3', '文档条目 4', '文档条目 5']

export default function DocumentPage() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900">
      {/* 左侧半圆导航栏 */}
      <div className="relative flex w-1/3 items-center justify-center overflow-hidden">
        {/* 半圆装饰层 */}
        <div className="absolute inset-0">
          <LeftCircle />
        </div>

        {/* 条目列表 */}
        <ul className="relative z-10 flex h-96 flex-col justify-around pl-20">
          {entries.map((entry, idx) => (
            <motion.li
              key={idx}
              className={`cursor-pointer text-lg font-medium transition-colors duration-200 ${
                selected === idx
                  ? 'scale-105 text-white'
                  : 'text-gray-800 hover:text-indigo-400 dark:text-gray-200'
              } origin-left`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(idx)}
            >
              {entry}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* 右侧详情区域 */}
      <div className="flex w-2/3 flex-col justify-start p-12">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl text-gray-900 dark:text-gray-100"
        >
          <h2 className="mb-4 text-2xl font-bold">{entries[selected]}</h2>
          <p>这里是 {entries[selected]} 的详细内容区域。你可以在这里显示文本、图片或其他组件。</p>
        </motion.div>
      </div>
    </div>
  )
}
