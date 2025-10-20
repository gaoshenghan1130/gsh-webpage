"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ScrollHeader from "@/components/ScrollHeader";
import { useEffect } from "react";

interface ProjectLayoutProps {
  title: string;
  intro: string;
  desc: string;
  link: string;
  image: string;
  tags?: string[];
  children?: ReactNode; // MDX正文
}

export default function ProjectLayout({
  title,
  intro,
  desc,
  link,
  image,
  tags = [],
  children,
}: ProjectLayoutProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // 禁止外部滚动
    return () => {
      document.body.style.overflow = originalOverflow; // 页面卸载时恢复
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto h-screen bg-white shadow-lg"
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
        <div className="pt-16"></div>

        {/* 项目标题 */}
        <header className="mb-6">
          <p className="text-gray-500">{intro}</p>
          {/* 标签 */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
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

        {/* 项目图片 */}
        {image && (
          <div className="mb-6 relative w-full h-64 sm:h-96">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* 项目链接 */}
        {link && (
          <p className="mb-6">
            <Link
              href={link}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Visit Project
            </Link>
          </p>
        )}

        {/* 描述 */}
        {desc && <p className="mb-6 text-lg text-gray-700">{desc}</p>}

        {/* MDX正文 */}
        {children && <div className="prose max-w-none">{children}</div>}
        <Footer />
      </div>
    </div>
  );
}
