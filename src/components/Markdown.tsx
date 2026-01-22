// src/components/Markdown.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const markdownSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "h1","h2","h3","h4","h5","h6",
    "p","a",
    "em","strong",   // ← ADD THESE
    "ul","ol","li",
    "blockquote",
    "pre","code",
    "hr",
    "br",
    "img",
    "table","thead","tbody","tr","th","td",
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "href", "target", "rel"],
    img: [...(defaultSchema.attributes?.img ?? []), "src", "alt", "title", "width", "height"],
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <article className="prose prose-stone lg:prose-xl  max-w-none
        [&_img]:max-w-full
        [&_img]:h-auto
        [&_img[height]]:w-auto


        
       [&_table]:w-full
        [&_table]:border-collapse
        [&_table]:table-fixed

        [&_td]:align-top
        [&_td]:p-0
        [&_td]:text-left

        [&_td:first-child]:pr-6

        [&_td_img]:block
        [&_td_img]:m-0
        [&_thead]:hidden

    ">    
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        skipHtml={false}
        rehypePlugins={[
            rehypeRaw,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [rehypeSanitize, markdownSchema],
        ]}
        >
        {content || ""}
    </ReactMarkdown>

    </article>
  );
}
