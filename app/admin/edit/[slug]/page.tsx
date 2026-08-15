"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((post) => {
        setTitle(post.title ?? "");
        setDescription(post.description ?? "");
        setDate(post.date ?? "");
        setTags((post.tags ?? []).join(", "));
        setAuthor(post.author ?? "");
        setPublished(post.published ?? true);
        setContent(post.content ?? "");
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setFetching(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/posts/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          description,
          date,
          tags: parsedTags,
          author: author.trim() || undefined,
          published,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to update post.");
        return;
      }

      setSuccess("Post updated. Changes will be live within 60 seconds.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-muted-foreground text-sm">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            required
            autoFocus
          />
        </Field>

        <Field label="Slug" hint="URL: /posts/{slug} — changing slug will break existing links">
          <input
            type="text"
            value={slug}
            disabled
            className={`${inputCls} opacity-50 cursor-not-allowed`}
          />
        </Field>

        <Field label="Description" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={inputCls}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" required>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Author">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Optional"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Tags" hint="Comma-separated, e.g. architecture, delivery">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2"
            className={inputCls}
          />
        </Field>

        <Field label="Content (MDX)" required>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className={`${inputCls} font-mono text-sm`}
            required
          />
        </Field>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-[#e05a2b]"
          />
          <span className="text-sm font-medium">Published</span>
        </label>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e05a2b] hover:bg-[#c44d21] text-white font-semibold py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 self-start"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#e05a2b] text-sm";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-[#e05a2b] ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
