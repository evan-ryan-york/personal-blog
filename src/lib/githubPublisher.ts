const DEFAULT_REPOSITORY = "evan-ryan-york/personal-blog";
const DEFAULT_BRANCH = "main";
const DEFAULT_API_URL = "https://api.github.com";

interface GitHubFile {
  content?: string;
  encoding?: string;
  sha?: string;
  type?: string;
}

interface GitHubCommitResult {
  commit?: {
    html_url?: string;
    sha?: string;
  };
}

export class PublishError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "PublishError";
  }
}

export function isGitHubPublishingConfigured(): boolean {
  return Boolean(process.env.GITHUB_PUBLISH_TOKEN);
}

function config() {
  const token = process.env.GITHUB_PUBLISH_TOKEN;
  if (!token) {
    throw new PublishError("Publishing is not configured yet.", 503);
  }

  const repository =
    process.env.GITHUB_PUBLISH_REPOSITORY || DEFAULT_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new PublishError("The publishing repository is misconfigured.", 503);
  }

  return {
    token,
    repository,
    branch: process.env.GITHUB_PUBLISH_BRANCH || DEFAULT_BRANCH,
    apiUrl: (process.env.GITHUB_API_URL || DEFAULT_API_URL).replace(/\/$/, ""),
  };
}

async function githubRequest<T>(
  url: string,
  token: string,
  init?: RequestInit
): Promise<{ response: Response; data: T | null }> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as T | null;
  return { response, data };
}

function publishFrontmatter(source: string): string {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    throw new PublishError("The post has invalid frontmatter.", 409);
  }

  const draftStatus = /^status:\s*(?:"draft"|'draft'|draft)\s*$/m;
  if (!draftStatus.test(frontmatter[1])) {
    throw new PublishError("This post is no longer a draft.", 409);
  }

  const updatedFrontmatter = frontmatter[0].replace(
    draftStatus,
    'status: "published"'
  );

  return updatedFrontmatter + source.slice(frontmatter[0].length);
}

export async function publishPost({
  slug,
  title,
}: {
  slug: string;
  title: string;
}): Promise<{ commitUrl: string | null; commitSha: string | null }> {
  const { token, repository, branch, apiUrl } = config();
  const filePath = `content/posts/${slug}/index.mdx`;
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const contentsUrl = `${apiUrl}/repos/${repository}/contents/${encodedPath}`;
  const getUrl = `${contentsUrl}?ref=${encodeURIComponent(branch)}`;

  const current = await githubRequest<GitHubFile>(getUrl, token);
  if (!current.response.ok) {
    console.error("GitHub content read failed:", current.response.status);
    throw new PublishError("Could not read the draft from GitHub.", 502);
  }

  if (
    current.data?.type !== "file" ||
    current.data.encoding !== "base64" ||
    !current.data.content ||
    !current.data.sha
  ) {
    throw new PublishError("GitHub returned an invalid draft file.", 502);
  }

  const source = Buffer.from(
    current.data.content.replace(/\s/g, ""),
    "base64"
  ).toString("utf8");
  const updated = publishFrontmatter(source);
  const commitTitle = title.replace(/[\r\n]+/g, " ").trim().slice(0, 120);

  const saved = await githubRequest<GitHubCommitResult>(contentsUrl, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Publish ${commitTitle || slug}`,
      content: Buffer.from(updated, "utf8").toString("base64"),
      sha: current.data.sha,
      branch,
    }),
  });

  if (!saved.response.ok) {
    console.error("GitHub content update failed:", saved.response.status);
    const status = saved.response.status === 409 ? 409 : 502;
    const message =
      status === 409
        ? "The draft changed while publishing. Refresh and try again."
        : "GitHub could not publish the draft.";
    throw new PublishError(message, status);
  }

  return {
    commitUrl: saved.data?.commit?.html_url || null,
    commitSha: saved.data?.commit?.sha || null,
  };
}
