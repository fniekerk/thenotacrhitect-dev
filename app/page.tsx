import type { Metadata } from "next";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 60;
import { PostCard } from "@/components/blog/PostCard";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { PostsContainer } from "@/components/animations/PostsContainer";

export const metadata: Metadata = {
  description:
    "Business and technology in equal measure — people, process, and delivery. I draw boxes, cross them out, and ship.",
};

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div>
      <AnimatedSection className="mb-12">
        <h1 className="sr-only">
          The Not Architect — I draw boxes, cross them out, and ship.
        </h1>
        <div className="rounded-2xl bg-brand-panel p-0 ring-1 ring-white/10 shadow-sm">
          <Image
            src="/thenotarchitect_logo_final.svg"
            alt="The Not Architect — a crossed-out C4 context diagram beside the wordmark"
            width={680}
            height={320}
            priority
            className="h-auto w-full max-w-xl block"
          />
        </div>
        <p className="mt-6 text-lg text-muted-foreground">
          Business and technology in equal measure — people, process, and
          delivery. The diagram is always the start, never the end.
        </p>
      </AnimatedSection>

      {posts.length === 0 ? (
        <AnimatedSection delay={0.2}>
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        </AnimatedSection>
      ) : (
        <PostsContainer>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </PostsContainer>
      )}
    </div>
  );
}
