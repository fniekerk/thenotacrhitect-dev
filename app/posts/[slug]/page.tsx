import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { TOC } from "@/components/blog/TOC";
import { Badge } from "@/components/ui/Badge";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      <AnimatedSection className="mb-10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
            {post.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground/70">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.author && (
            <span className="before:content-['·'] before:mx-2">{post.author}</span>
          )}
        </p>
      </AnimatedSection>

      {post.toc && post.toc.length > 0 && (
        <AnimatedSection direction="left" delay={0.1} className="mb-8">
          <TOC items={post.toc} />
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.2}>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
          />
        </div>
      </AnimatedSection>
    </article>
  );
}
