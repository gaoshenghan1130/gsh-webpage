'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface LeftFilterProps {
  skillCategories: { category: string; skills: string[] }[]
  selectedSkills: string[]
  onChange: (skill: string) => void
}

export default function LeftFilter({ skillCategories, selectedSkills, onChange }: LeftFilterProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div className="fixed top-[25.0%] left-0 flex h-[73.0%] w-1/4 flex-col overflow-y-auto rounded-r-3xl border border-gray-200/50 bg-white/60 px-6 py-4 shadow-md backdrop-blur-2xl transition-all duration-300">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-800 uppercase">Filter</h3>

      <div className="space-y-2">
        {skillCategories.map((group) => {
          const isOpen = openCategories.includes(group.category)
          return (
            <div key={group.category}>
              {/* 类别标题 */}
              <button
                onClick={() => toggleCategory(group.category)}
                className="flex w-full items-center justify-between text-gray-700 transition-colors duration-200 hover:text-black"
              >
                <span className="text-sm font-semibold">{group.category}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* 展开技能列表 */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="mt-2 flex flex-col gap-1 overflow-hidden pl-3"
                  >
                    {group.skills.map((skill) => {
                      const selected = selectedSkills.includes(skill)
                      return (
                        <motion.button
                          key={skill}
                          onClick={() => onChange(skill)}
                          whileTap={{ scale: 0.97 }}
                          className={`rounded-md px-2 py-1 text-left text-sm transition-colors duration-150 ${
                            selected
                              ? 'bg-blue-100 font-medium text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {skill}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
