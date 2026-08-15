import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date from frontmatter
  author: string;
  tags: string[];
  image: string;
  excerpt: string;
  readingMinutes: number;
  content: string; // raw markdown body (for rendering + estimated reading time)
}

export interface BlogPostWithHtml extends BlogPostMeta {
  /** ISO 8601 string for BlogPosting schema (date + default time) */
  datePublished: string;
  /** ISO 8601 modified date — same as published unless overridden */
  dateModified: string;
  url: string;
}

/** Get all blog post metadata, sorted by date descending (newest first). */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts: BlogPostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
    const { data: frontmatter, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      date: frontmatter.date ?? new Date().toISOString(),
      author: frontmatter.author ?? "Pixquish",
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      image: frontmatter.image ?? "/og-image.png",
      excerpt: frontmatter.excerpt ?? frontmatter.description ?? "",
      readingMinutes: Math.max(1, Math.round(stats.minutes)),
      content,
    };
  });

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get a single blog post by slug. Returns null if not found. */
export function getPostBySlug(slug: string): BlogPostWithHtml | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const filepath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf8");
  const { data: frontmatter, content } = matter(raw);
  const stats = readingTime(content);

  const date = frontmatter.date ?? new Date().toISOString();
  const datePublished = new Date(date).toISOString();
  const dateModified = frontmatter.updatedAt
    ? new Date(frontmatter.updatedAt).toISOString()
    : datePublished;

  return {
    slug,
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? "",
    date,
    author: frontmatter.author ?? "Pixquish",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    image: frontmatter.image ?? "/og-image.png",
    excerpt: frontmatter.excerpt ?? frontmatter.description ?? "",
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    content,
    datePublished,
    dateModified,
    url: `/blog/${slug}`,
  };
}

/** Get all slugs — used for static generation of /blog/[slug] routes. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
