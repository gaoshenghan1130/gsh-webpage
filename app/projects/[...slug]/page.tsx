// app/projects/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { allJSONs, allProjects } from ".contentlayer/generated";
import { coreContent } from "pliny/utils/contentlayer";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import { components } from "@/components/MDXComponents";
import ProjectLayout from "@/layouts/ProjectLayout";

export const generateStaticParams = async () => {
  const jsonSlugs = allJSONs.map((p) => p.name);
  const mdxSlugs = allProjects.map((p) => p.slug);
  const allSlugs = [...jsonSlugs, ...mdxSlugs];
  return allSlugs.map((slug) => ({ slug: [slug] }));
};

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params; // 解包 Promise
  const decodedSlug = decodeURI(slug.join("/"));

  const projectMDX = allProjects.find((p) => p.slug === decodedSlug);

  if (!projectMDX) return notFound();

  const content = coreContent(projectMDX);

  return (
    <ProjectLayout
      title={projectMDX.name}
      intro={projectMDX.intro}
      desc={projectMDX.desc}
      link={projectMDX.link}
      image={projectMDX.image}
      tags={projectMDX.tags}
    >
      <MDXLayoutRenderer
        code={projectMDX.body.code}
        components={components}
        toc={projectMDX.toc}
      />
    </ProjectLayout>
  );
}
