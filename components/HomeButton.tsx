'use client'

import { useRouter } from 'next/navigation'

export default function HomeButton() {
  const router = useRouter()

  return (
    <button
      className="fixed top-1/2 left-[-1vw] z-[9999] flex h-40 w-16 cursor-pointer items-center justify-center bg-transparent"
      style={{
        height: '100vh',
        transform: 'translateY(-50%)',
        writingMode: 'vertical-rl',
        pointerEvents: 'auto',
      }}
      onClick={() => {
        console.log('Button clicked')
        router.push('/')
      }}
    >
      <span
        className="text-2xl font-bold text-white opacity-20 transition-all duration-300"
        style={{
          textShadow: 'none',
          letterSpacing: '2em',
        }}
      >
        HOME
      </span>

      <style jsx>{`
        button:hover span {
          opacity: 1; /* hover 时文字变可见 */
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.8),
            0 0 16px rgba(255, 255, 255, 0.5); /* 发光 + 阴影 */
        }
      `}</style>
    </button>
  )
}
