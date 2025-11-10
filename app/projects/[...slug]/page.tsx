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

  const childProjects = (): CoreContent<Project>[] => {
    console.log("Project MDX:", projectMDX?.childrenProjects);
    if (!projectMDX || !projectMDX.childrenProjects) return [];

    const result: CoreContent<Project>[] = [];

    for (const proj of projectMDX.childrenProjects) {
      const child = allProjects.find((p) => p.name === proj);
      if (child) {
        result.push(coreContent(child));
      }
      console.log("Child project:", child);
    }

    return result;
  };

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
      childrenProjects={childProjects()}
    >
      <MDXLayoutRenderer
        code={projectMDX.body.code}
        components={components}
        toc={projectMDX.toc}
      />
    </ProjectLayout>
  );
}
