import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? "Blog Post";
  const description = post?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            marginBottom: 24,
            fontFamily: "serif",
          }}
        >
          <span style={{ color: "#e05a2b", fontSize: 30, fontWeight: 700 }}>X</span>
          <span style={{ color: "#94a3b8" }}>The Not Architect</span>
        </div>
        <div
          style={{
            color: "#f8fafc",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 24,
            fontFamily: "sans-serif",
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              color: "#94a3b8",
              fontSize: 28,
              lineHeight: 1.5,
              fontFamily: "sans-serif",
              maxWidth: 800,
            }}
          >
            {description}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
