import { getAllPosts } from '$lib/posts.js';

// Reads src/posts from the filesystem via getAllPosts, which only works at
// build time / in dev (see the comment in posts.js) — must be prerendered.
export const prerender = true;

export async function GET() {
	const baseUrl = 'https://joshnicholas.blog';
	const posts = getAllPosts();

	// Only include public pages in sitemap
	// Admin pages (/post, /api) are excluded
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${baseUrl}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	${posts.map(post => `
	<url>
		<loc>${baseUrl}/${post.slug}</loc>
		<lastmod>${new Date(post.updated || post.created).toISOString().split('T')[0]}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`).join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
