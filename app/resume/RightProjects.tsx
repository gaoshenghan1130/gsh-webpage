"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Project {
  name: string;
  fullname: string;
  file: string;
  link: string;
  intro: string;
  tags: string[];
  image: string;
  desc: string;
}

interface RightProjectsProps {
  projects: Project[];
}

export default function RightProjects({ projects }: RightProjectsProps) {
  const router = useRouter();
  return (
    <div className="fixed top-[22%] right-9 h-[75vh] max-h-[75vh] w-[70%] overflow-y-auto pr-6">
      <div className="relative top-[5vh] left-3 flex w-full flex-wrap overflow-visible">
        {projects.map((project, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);

          return (
            <motion.div
              key={project.name}
              whileHover={{ scale: 1.08, zIndex: 10000 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="group relative aspect-square w-[28%] cursor-pointer overflow-hidden rounded-2xl bg-white/50 shadow-md backdrop-blur-xl transition-all duration-300 hover:shadow-2xl focus:outline-none"
              style={{
                zIndex: col * 100 + row,
                marginLeft: col === 0 ? 0 : "-4%", // 横向交叠
                marginTop: row === 0 ? 0 : "-4%", // 纵向交叠
              }}
              onClick={() => {
                // 清除当前聚焦元素，防止蓝框残留
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                window.open(`/${project.file}`, "_blank");
              }}
            >
              {/* 封面图 */}
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-130"
              />

              {/* 顶部标题条 */}
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/40 to-transparent p-2">
                <h4 className="text-sm font-semibold text-white drop-shadow-md w-[70%]">
                  {project.fullname}
                </h4>
              </div>

              {/* 悬浮详情 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col justify-end bg-black/70 p-3 opacity-0 group-hover:opacity-100"
              >
                <h4 className="mb-1 text-xs font-semibold text-white">
                  {project.fullname}
                </h4>
                <p className="mb-1 line-clamp-2 text-[11px] text-gray-200">
                  {project.intro}
                </p>

                <div className="mb-2 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-200/20 px-1.5 py-0.5 text-[9px] font-medium text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-blue-300 hover:text-blue-100 z-[9999]"
                >
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
