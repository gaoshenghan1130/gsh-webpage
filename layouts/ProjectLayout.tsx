"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ScrollHeader from "@/components/ScrollHeader";
import { useEffect } from "react";
import type { CoreContent } from "pliny/utils/contentlayer";
import type { Project } from ".contentlayer/generated";
import { allJSONs } from ".contentlayer/generated";

interface ProjectLayoutProps {
  title: string;
  intro: string;
  desc: string;
  link: string;
  image: string;
  tags?: string[];
  children?: ReactNode;
  childrenProjects?: (typeof allJSONs)[number][];
  related?: (typeof allJSONs)[number][];
}

export default function ProjectLayout({
  title,
  intro,
  desc,
  link,
  image,
  tags = [],
  children,
  childrenProjects,
  related,
}: ProjectLayoutProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- 全局两栏布局 --- */}
      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-12 h-screen">
        {/* --- 左侧正文 --- */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-white shadow-lg rounded-lg p-6 max-h-screen"
        >
          <ScrollHeader containerRef={containerRef}>
            <div className="flex items-center justify-between">
              <h1
                className="text-3xl font-bold text-gray-500 transition-all duration-300 
                hover:text-black/70 hover:scale-105 
                hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] cursor-pointer"
              >
                {title}
              </h1>
              <Link
                href="/resume"
                className="text-xl text-blue-300 transition-all duration-300 hover:scale-110 hover:text-blue-400 hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]"
              >
                Back
              </Link>
            </div>
          </ScrollHeader>

          <div className="pt-16 mt-4"></div>

          {image && (
            <div className="relative w-full sm:h-96 -mt-9">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}

          {desc && (
            <p className="mb-6 text-sm text-gray-400 text-center mx-auto max-w-prose">
              {desc}
            </p>
          )}

          <div className="prose prose-sm max-w-none mb-12">{children}</div>

          <Footer />
        </div>

        {/* --- 右侧栏 --- */}
        <div className="mt-[3vh] max-h-[77vh] w-72 shrink-0 overflow-y-auto h-full bg-white/60 rounded-lg shadow-lg backdrop-blur-xl p-4 hidden lg:block">
          <header className="mb-4 mt-[4vh]">
            {/* 标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 ">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          {childrenProjects && childrenProjects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Child Projects
              </h2>
              {childrenProjects.map((child) => (
                <div key={child.slug} className="mb-6">
                  <h3 className="text-md font-medium text-gray-600 mb-1">
                    {child.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">{child.intro}</p>
                  <Link
                    href={`/projects/${child.slug}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          )}

          {related && related.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Related Projects
              </h2>
              {related.map((rel) => (
                <div key={rel.slug} className="mb-6">
                  <h3 className="text-md font-medium text-gray-600 mb-1">
                    {rel.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">{rel.intro}</p>
                  <Link
                    href={`/projects/${rel.slug}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
