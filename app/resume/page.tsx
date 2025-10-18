'use client'

import LeftFilter from './LeftFilter'
import Timeline from './timeline'
import skillCategories from '@/data/projects/skills.json'
import { useState } from 'react'

export default function ResumePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  return (
    <main className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Timeline />
      <LeftFilter
        skillCategories={skillCategories}
        selectedSkills={selectedSkills}
        onChange={handleSkillToggle}
      />
    </main>
  )
}
