import { Link, useParams } from "react-router-dom";
import { POSTS, formatDate, postBySlug, type Block } from "../content/blog";
import { PageHeader } from "../components/PageHeader";
import { JsonLd } from "../components/JsonLd";
import { articleSchema, breadcrumbs } from "../utils/schema";
import { ArrowIcon, Seo, SplitButton } from "../components/ui";
import { CtaBand } from "../sections/CtaBand";
import NotFound from "./NotFound";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-6 text-2xl leading-snug font-medium tracking-[-0.01em] text-ink sm:text-3xl">{block.text}</h2>;
    case "p":
      return <p className="text-lg leading-relaxed text-body">{block.text}</p>;
    case "note":
      return <p className="border-l-2 border-gold bg-white/70 py-4 pr-4 pl-5 text-lg leading-relaxed text-ink">{block.text}</p>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`flex flex-col gap-3 pl-6 text-lg leading-relaxed text-body ${block.ordered ? "list-decimal" : "list-disc"} marker:text-emerald-deep`}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-[10px] border border-line">
          <table className={`w-full border-collapse text-left ${block.head.length > 2 ? "min-w-[560px]" : ""}`}>
            <thead className="bg-night text-pearl">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-sm font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/70">
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-line">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={cell} scope="row" className="px-4 py-3 align-top font-medium whitespace-nowrap text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={cell} className="px-4 py-3 align-top text-body">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = postBySlug(slug);
  if (!post) return <NotFound />;

  const path = `/blog/${post.slug}`;
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Seo title={`${post.seoTitle ?? post.title} | Veridian Tech`} description={post.description} />
      <JsonLd
        data={[
          articleSchema({ title: post.title, description: post.description, path, published: post.published, updated: post.updated }),
          breadcrumbs([["Blog", "/blog"], [post.title, path]]),
        ]}
      />
      <PageHeader
        eyebrow={`Blog · ${post.topic}`}
        title={post.title}
        sub={
          <span className="text-base">
            <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readMinutes} min read · Veridian Tech
          </span>
        }
      />

      <article className="mx-auto flex max-w-3xl flex-col gap-6 px-5 pb-16 sm:px-8">
        {post.body.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
        <div className="mt-8 flex flex-col gap-5 rounded-[10px] border border-line bg-white/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="text-lg font-medium text-ink">Ready to talk about your project?</p>
          <SplitButton to={post.next.to}>{post.next.label}</SplitButton>
        </div>
      </article>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="mb-6 text-xs font-semibold tracking-[0.16em] text-muted uppercase">More guides</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`} className="flex h-full flex-col gap-3 rounded-[10px] border border-line bg-white/70 p-6 transition-colors hover:border-emerald">
                  <span className="text-lg font-medium text-ink">{p.title}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-deep">
                    Read <ArrowIcon size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
