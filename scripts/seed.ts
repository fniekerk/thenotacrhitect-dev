import { db } from "../lib/db";
import { posts } from "../lib/db/schema";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  const helloWorld = readFileSync(
    join(process.cwd(), "content/posts/hello-world.mdx"),
    "utf-8"
  );

  const body = helloWorld.replace(/^---[\s\S]+?---\n/, "").trim();

  await db
    .insert(posts)
    .values({
      slug: "hello-world",
      title: "Hello World",
      description:
        "The first post on this blog — introducing what this site is about and what you can expect going forward.",
      date: "2026-06-14",
      content: body,
      published: true,
      tags: ["meta", "introduction"],
      author: "Blog Author",
      toc: [
        { title: "Welcome", url: "#welcome", depth: 2 },
        { title: "What to Expect", url: "#what-to-expect", depth: 2 },
        { title: "Stack at a Glance", url: "#stack-at-a-glance", depth: 2 },
        { title: "Code Example", url: "#code-example", depth: 2 },
      ],
    })
    .onConflictDoNothing();

  console.log("Seeded hello-world post.");
}

main().catch(console.error).finally(() => process.exit(0));
