import { getRecentPosts } from '$lib/posts.js';

export const prerender = true;

export function load() {
	return {
		posts: getRecentPosts(5)
	};
}
