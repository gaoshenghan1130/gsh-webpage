import React from "react";
import Prism from "prismjs";

// 导入你需要的语言
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-bash";

function extractText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (React.isValidElement(node)) return extractText(node.props.children);
  if (Array.isArray(node)) return node.map(extractText).join("");
  return "";
}

interface InlineCodeProps {
  children: React.ReactNode;
  lang?: "js" | "ts" | "python" | "cpp" | "c" | "bash"; // 可扩展
}

export default function InlineCode({ children, lang = "js" }: InlineCodeProps) {
  const codeString = extractText(children);

  // 如果语言不支持，使用 plain text
  const grammar = Prism.languages[lang] || Prism.languages.plain;
  const html = Prism.highlight(codeString, grammar, lang);

  return (
    <code
      className="rounded px-1 py-0.5 font-mono text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
