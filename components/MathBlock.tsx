"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import { useEffect, useRef } from "react";

export default function MathBlock({ expression }: { expression: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(expression, ref.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [expression]);

  return <div ref={ref} />;
}
