import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export async function renderMDX(
  source: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Record<string, React.ComponentType<any>> = {}
) {
  const code = String(
    await compile(source, {
      outputFormat: "function-body",
      rehypePlugins: [
        [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { default: MDXContent } = await run(code, runtime as any);

  return <MDXContent components={components} />;
}
