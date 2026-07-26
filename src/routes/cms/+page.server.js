import { getAllPosts } from '$lib/posts.js';
import { getAllPostsFromGitHub } from '$lib/server/postsRemote.js';

export async function load() {
	const posts = process.env.VERCEL ? await getAllPostsFromGitHub() : getAllPosts();
	return { posts };
}
