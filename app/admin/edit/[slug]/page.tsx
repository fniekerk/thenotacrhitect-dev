"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageInBlob, setImageInBlob] = useState(false);
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
        setImage(post.image ?? "");
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setFetching(false));
  }, [slug]);

  async function handleImageChange(file: File | undefined) {
    if (!file) return;
    setImageError("");
    setImageUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setImageError(data.error ?? "Upload failed.");
        return;
      }
      setImage(data.url);
      setImageInBlob(true);
    } catch {
      setImageError("Upload failed.");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleRemoveImage() {
    if (imageInBlob && image) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: image }),
      }).catch(() => {});
    }
    setImage("");
    setImageInBlob(false);
  }

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
          image: image || undefined,
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

  if (fetching) {
    return <p className="text-muted-foreground text-sm">Loading post…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit Post</h1>

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

        <Field label="Cover image" hint="JPEG, PNG, WebP, GIF or AVIF · max 10 MB">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              disabled={imageUploading}
              onChange={(e) => handleImageChange(e.target.files?.[0])}
              className={`${inputCls} file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#e05a2b] file:text-white hover:file:bg-[#c44d21] file:cursor-pointer`}
            />
            {imageUploading && (
              <p className="text-xs text-muted-foreground">Uploading…</p>
            )}
            {imageError && (
              <p className="text-xs text-red-500">{imageError}</p>
            )}
            {image && !imageUploading && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Cover preview" className="h-16 w-24 object-cover rounded border border-border" />
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">Current image</p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{image}</p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-500 hover:underline self-start"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
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
          disabled={loading || imageUploading}
          className="bg-[#e05a2b] hover:bg-[#c44d21] text-white font-semibold py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 self-start"
        >
          {loading ? "Saving…" : imageUploading ? "Uploading image…" : "Save changes"}
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
