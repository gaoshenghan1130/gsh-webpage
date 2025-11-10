import TOCInline from "pliny/ui/TOCInline";
import Pre from "pliny/ui/Pre";
import BlogNewsletterForm from "pliny/ui/BlogNewsletterForm";
import type { MDXComponents } from "mdx/types";
import Image from "./Image";
import CustomLink from "./Link";
import TableWrapper from "./TableWrapper";
import MermaidChart from "./mermaidChart";
import AutoPlayVideo from "@/components/AutoVideoPlayer";
import InlineCode from "@/components/inlinecode";
import MathBlock from "@/components/MathBlock";

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  Video: AutoPlayVideo,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  MermaidChart,
  code: InlineCode,
  // inlineCode: InlineCode,
  InlineCode,
  MathBlock,
};
