'use client'

import { useState, useEffect } from 'react'

export function useWindowHeight() {
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0)

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight)
    handleResize() // 初始化立即执行一次
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return height
}
