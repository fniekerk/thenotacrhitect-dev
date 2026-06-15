const API = "https://api.github.com";

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function repoBase() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) throw new Error("GITHUB_OWNER or GITHUB_REPO is not set");
  return `${API}/repos/${owner}/${repo}`;
}

export async function fileExists(path: string): Promise<boolean> {
  const res = await fetch(`${repoBase()}/contents/${path}`, {
    headers: headers(),
  });
  return res.status === 200;
}

export async function createFile(path: string, content: string, message: string) {
  const res = await fetch(`${repoBase()}/contents/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `GitHub API ${res.status}`);
  }

  return res.json();
}
