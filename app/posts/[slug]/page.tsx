import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thenotarchitect.dev";
  const postUrl = `${siteUrl}/posts/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      ...(post.image && {
        images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thenotarchitect.dev";
  const postUrl = `${siteUrl}/posts/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author ?? "The Not Architect" },
    publisher: { "@id": `${siteUrl}/#org` },
    mainEntityOfPage: postUrl,
    ...(post.image && { image: post.image }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: post.title, item: postUrl },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

      {post.image && (
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </AnimatedSection>
      )}

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
