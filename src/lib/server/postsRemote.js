import { parsePostFile, filenameToDate } from '$lib/posts.js';
import { listDirectory, getFileContent } from './github.js';

const POSTS_PATH = 'src/posts';

// Reads posts via the GitHub API instead of the filesystem. Needed because
// src/posts isn't present in Vercel's deployed serverless function (see
// $lib/posts.js) — only used by dynamic /cms routes when running on Vercel.
export async function getAllPostsFromGitHub() {
	const entries = await listDirectory(POSTS_PATH);
	const filenames = entries
		.filter((e) => e.type === 'file' && e.name.endsWith('.html'))
		.map((e) => e.name)
		.sort((a, b) => filenameToDate(b) - filenameToDate(a));

	return Promise.all(
		filenames.map(async (filename) => {
			const content = await getFileContent(`${POSTS_PATH}/${filename}`);
			return parsePostFile(filename, content);
		})
	);
}

export async function getPostBySlugFromGitHub(slug) {
	const content = await getFileContent(`${POSTS_PATH}/${slug}.html`);
	if (content === null) return null;
	return parsePostFile(`${slug}.html`, content);
}
