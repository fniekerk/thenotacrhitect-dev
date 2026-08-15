"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PostSummary {
  id: number;
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
}

export default function AdminPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setPosts)
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Posts</h1>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.id} className="py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{post.title}</span>
                  {!post.published && (
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                  <span>{post.date}</span>
                  <span className="font-mono">/posts/{post.slug}</span>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <Link
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="text-sm text-[#e05a2b] hover:text-[#c44d21] font-medium transition-colors"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
