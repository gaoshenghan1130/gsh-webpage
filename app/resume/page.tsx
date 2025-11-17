"use client";

import LeftFilter from "./LeftFilter";
import RightProjects from "./RightProjects";
import Timeline from "./timeline";
import skillCategories from "../data/skills.json";
import { useState } from "react";
import { projectList } from "@/components/allProjects";

export default function ResumePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    skillCategories.flatMap((c) => c.skills),
  );

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const filteredProjects = projectList.filter((project) => {
    if (selectedSkills.length === 0) return true;
    return selectedSkills.some((skill) => project.tags.includes(skill));
  });

  return (
    <main className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* <div className="w-full bg-yellow-400 text-black text-center py-2 font-medium relative z-[99999]">
        This page is under construction. Some content may be incomplete or
        outdated. Please refer to{" "}
        <a
          href="https://github.com/gaoshenghan1130"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-700 z-[999]"
        >
          GitHub
        </a>{" "}
        for latest updates.
      </div> */}
      <Timeline />
      <LeftFilter
        skillCategories={skillCategories}
        selectedSkills={selectedSkills}
        onChange={handleSkillToggle}
      />
      <RightProjects projects={filteredProjects} />
    </main>
  );
}
