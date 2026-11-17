import { Link } from "react-router-dom";
import { POSTS, formatDate } from "../content/blog";
import { PageHeader } from "../components/PageHeader";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../utils/schema";
import { Accent, ArrowIcon, Seo } from "../components/ui";
import { CtaBand } from "../sections/CtaBand";

export default function Blog() {
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <Seo
        title="Guides: Websites, Google and IT Supply | Veridian Tech"
        description="Plain-English guides on website costs and timelines, getting found on Google, and buying laptops and office IT in bulk, from Veridian Tech in Lagos."
      />
      <JsonLd data={breadcrumbs([["Blog", "/blog"]])} />
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            Straight answers, <Accent>before you spend.</Accent>
          </>
        }
        sub="Guides to the questions businesses ask us most: what a website costs, how long it takes, why a site is not on Google, and how to buy IT equipment in bulk."
      />
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.slug} className="reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <Link
                to={`/blog/${post.slug}`}
                className="flex h-full flex-col gap-4 rounded-[10px] border border-line bg-white/70 p-6 transition-colors hover:border-emerald sm:p-8"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-emerald-deep uppercase">{post.topic}</span>
                <h2 className="text-[22px] leading-snug font-medium tracking-[-0.01em] text-ink">{post.title}</h2>
                <p className="leading-relaxed text-body">{post.description}</p>
                <span className="mt-auto flex items-center justify-between gap-4 pt-2 text-sm text-muted">
                  <time dateTime={post.published}>{formatDate(post.published)}</time>
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-deep">
                    {post.readMinutes} min read <ArrowIcon size={16} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
