"use client";
import dynamic from "next/dynamic";
import { FC } from "react";

interface MermaidChartProps {
  chart: string;
}

// Tell TS that this dynamic import is a component that accepts `MermaidChartProps`
const Mermaid = dynamic<MermaidChartProps>(() => import("react-mermaid2"), {
  ssr: false,
});

const MermaidChart: FC<MermaidChartProps> = ({ chart }) => {
  return <Mermaid chart={chart} />;
};

export default MermaidChart;
