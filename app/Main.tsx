'use client'

import { motion } from 'framer-motion'

export default function Main() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-black text-white">
      {/* 背景层：星空或动态粒子 */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d')] bg-cover bg-fixed bg-center opacity-60"></div>

      {/* 半透明遮罩层 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* 主体内容 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold tracking-wide"
        >
          Welcome to <span className="text-cyan-400">My Space</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg text-gray-300"
        >
          Explore my work or learn more about me
        </motion.p>

        {/* 按钮 */}
        <div className="mt-6 flex space-x-8">
          <motion.a
            href="/resume"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl bg-purple-600/80 px-8 py-4 font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-purple-500"
          >
            View Resume / About Me
          </motion.a>
        </div>
      </div>
    </div>
  )
}
