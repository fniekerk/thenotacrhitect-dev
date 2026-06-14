import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-ring/50 hover:-translate-y-0.5">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2 leading-snug">
        <Link
          href={`/posts/${post.slug}`}
          className="hover:text-brand transition-colors after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </h2>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
        {post.description}
      </p>
      <time
        dateTime={post.date}
        className="text-xs text-muted-foreground/70 font-medium"
      >
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </article>
  );
}
