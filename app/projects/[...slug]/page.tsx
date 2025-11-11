// app/projects/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { allJSONs, allProjects } from ".contentlayer/generated";
import { coreContent } from "pliny/utils/contentlayer";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import { components } from "@/components/MDXComponents";
import ProjectLayout from "@/layouts/ProjectLayout";
import type { CoreContent } from "pliny/utils/contentlayer";
import type { Project } from ".contentlayer/generated";

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

  // find related or child projects
  const childProjects = (): (typeof allJSONs)[number][] => {
    if (!projectMDX || !projectMDX.childrenProjects) return [];

    const result: (typeof allJSONs)[number][] = [];

    for (const proj of projectMDX.childrenProjects) {
      const child = allJSONs.find((p) => p.name === proj);
      if (child) {
        result.push(child);
      }
    }

    return result;
  };

  const relatedProjects = (): (typeof allJSONs)[number][] => {
    if (!projectMDX) return [];

    const tags = projectMDX.tags;

    const result: (typeof allJSONs)[number][] = [];

    for (const tag of tags) {
      for (const proj of allJSONs) {
        // exclude self and duplicates
        if (
          proj.tags.includes(tag) &&
          proj.slug !== projectMDX.slug &&
          !result.includes(proj)
        ) {
          if (childProjects().includes(proj)) continue; // skip child projects
          result.push(proj);
        }
      }
    }

    return result;
  };
  if (!projectMDX) {
    notFound();
  }
  return (
    <ProjectLayout
      title={projectMDX.name}
      intro={projectMDX.intro}
      desc={projectMDX.desc}
      link={projectMDX.link}
      image={projectMDX.image}
      tags={projectMDX.tags}
      childrenProjects={childProjects()}
      related={relatedProjects()}
    >
      <MDXLayoutRenderer
        code={projectMDX.body.code}
        components={components}
        toc={projectMDX.toc}
      />
    </ProjectLayout>
  );
}
