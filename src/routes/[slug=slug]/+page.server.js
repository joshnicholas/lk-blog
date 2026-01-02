import { getPostBySlug, getAllPosts } from '$lib/posts.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

export function entries() {
	const posts = getAllPosts();
	return posts.map(post => ({
		slug: post.slug
	}));
}

export async function load({ params }) {
	const post = getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
}
