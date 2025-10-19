import { defineDocumentType, makeSource } from "@contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "projects/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: false },
  },
}));

export default makeSource({
  contentDirPath: "projects",
  documentTypes: [Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
