import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://romancecanvas.com";

  // Static pages
  const staticPages = [
    "",
    "/features",
    "/how-it-works",
    "/pricing",
    "/contact",
    "/faq",
    "/chat", // Romantic AI Chat
    "/romance/create", // Create Romance Story
    "/blog", // Blog homepage
    "/legal/terms",
    "/legal/privacy",
    "/legal/refund",
  ];

  // Blog posts
  const blogPosts = [
    "/blog/ultimate-guide-writing-romance-stories",
    "/blog/10-best-ai-story-generators-2024",
    "/blog/create-interactive-fiction-beginners",
    "/blog/romance-writing-prompts-generator",
    "/blog/ai-romance-chat-guide",
    "/blog/character-development-romance-novels",
  ];

  // Fetch dynamic story pages (public stories)
  let stories = [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stories/public?limit=1000`
    );
    stories = await response.json();
  } catch (error) {
    console.error("Failed to fetch stories for sitemap:", error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}

  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}${post}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}

  ${stories
    .map(
      (story: any) => `
  <url>
    <loc>${baseUrl}/romance/story/${story._id}</loc>
    <lastmod>${new Date(
      story.updatedAt || story.createdAt
    ).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${
      story.imageUrl
        ? `
    <image:image>
      <image:loc>${story.imageUrl}</image:loc>
      <image:title>${story.title}</image:title>
    </image:image>`
        : ""
    }
  </url>`
    )
    .join("")}

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
