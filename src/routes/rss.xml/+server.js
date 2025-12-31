import { getAllPosts } from '$lib/posts.js';

export const prerender = true;

export async function GET() {
	const posts = getAllPosts();
	const siteUrl = 'https://joshnicholas.com';
	const siteTitle = 'Josh Nicholas';
	const siteDescription = 'Josh Nicholas is a journalist and scribbler';

	const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
	<title>${siteTitle}</title>
	<description>${siteDescription}</description>
	<link>${siteUrl}</link>
	<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
	${posts.map(post => {
		// Extract first 150 chars of content for description
		const textContent = post.content.replace(/<[^>]*>/g, '').substring(0, 150);
		// Use header as title if it exists, otherwise use first line of content
		const title = post.content.match(/<p class="header">(.*?)<\/p>/)?.[1]
			|| textContent.substring(0, 50)
			|| post.id;

		return `
	<item>
		<title><![CDATA[${title}]]></title>
		<description><![CDATA[${textContent}...]]></description>
		<link>${siteUrl}/#${post.slug}</link>
		<guid isPermaLink="false">${post.id}</guid>
		<pubDate>${new Date(post.created).toUTCString()}</pubDate>
		<content:encoded><![CDATA[${post.content}]]></content:encoded>
	</item>`;
	}).join('')}
</channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
