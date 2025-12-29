export async function GET({ url }) {
	const baseUrl = url.origin;

	// Only include public pages in sitemap
	// Admin pages (/post, /api) are excluded
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${baseUrl}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
