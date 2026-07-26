import { getAllPosts } from '$lib/posts.js';
import { getAllPostsFromGitHub } from '$lib/server/postsRemote.js';

export async function load() {
	if (!process.env.VERCEL) {
		return { posts: getAllPosts() };
	}

	try {
		return { posts: await getAllPostsFromGitHub() };
	} catch (err) {
		console.error('Failed to load posts from GitHub:', err);
		const detail = err?.status ? `${err.status} ${err.message}` : err?.message || String(err);
		return {
			posts: [],
			loadError: `Could not load posts from GitHub (${detail}). Check GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO in your Vercel project's environment variables.`
		};
	}
}
