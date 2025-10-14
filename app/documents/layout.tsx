'use client'

import { ReactNode } from 'react'
import SectionContainer from '@/components/SectionContainer'

export default function DocumentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}
