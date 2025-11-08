import React from "react";

function extractText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (React.isValidElement(node)) {
    return extractText(node.props.children);
  }
  if (Array.isArray(node)) return node.map((n) => extractText(n)).join("");
  return "";
}

export default function InlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  const raw = extractText(children);
  const text = raw.replace(/^`+|`+$/g, ""); // 去掉可能的反引号
  return (
    <span className="font-semibold text-inherit text-blue-600">{text}</span>
  );
}
