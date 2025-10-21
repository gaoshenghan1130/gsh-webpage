"use client";

import LeftFilter from "./LeftFilter";
import RightProjects from "./RightProjects";
import Timeline from "./timeline";
import skillCategories from "../data/skills.json";
import { useState } from "react";
import pointSys from "@/data/projects/pointSys.json";
import teleop from "@/data/projects/teleop.json";
import udpserver from "@/data/projects/udpServer.json";
import rrcc from "@/data/projects/RRCC.json";

export default function ResumePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <main className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full bg-yellow-400 text-black text-center py-2 font-medium">
        This page is under construction. Some content may be incomplete or
        outdated. Please refer to{" "}
        <a
          href="https://github.com/gaoshenghan1130"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-700"
        >
          GitHub
        </a>{" "}
        for latest updates.
      </div>
      <Timeline />
      <LeftFilter
        skillCategories={skillCategories}
        selectedSkills={selectedSkills}
        onChange={handleSkillToggle}
      />
      <RightProjects projects={[pointSys, udpserver, rrcc, teleop]} />
    </main>
  );
}
