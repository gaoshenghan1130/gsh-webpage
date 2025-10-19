"use client";

import LeftFilter from "./LeftFilter";
import RightProjects from "./RightProjects";
import Timeline from "./timeline";
import skillCategories from "@/data/projects/skills.json";
import { useState } from "react";
import pointSys from "@/data/projects/pointSys.json";
import teleop from "@/data/projects/teleop.json";
import udpserver from "@/data/projects/udpServer.json";

export default function ResumePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <main className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Timeline />
      <LeftFilter
        skillCategories={skillCategories}
        selectedSkills={selectedSkills}
        onChange={handleSkillToggle}
      />
      <RightProjects projects={[pointSys, teleop, udpserver]} />
    </main>
  );
}
