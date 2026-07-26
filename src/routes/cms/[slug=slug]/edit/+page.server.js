import { error, fail, redirect } from '@sveltejs/kit';
import { getPostBySlug, writePostFileLocally, deletePostFileLocally } from '$lib/posts.js';
import { commitFile, deleteFile } from '$lib/server/github.js';
import {
	generatePostTimestamp,
	renderContent,
	withHeader,
	detectAutoTags,
	mergeTags,
	buildFileContent,
	splitHeader
} from '$lib/server/postEditor.js';

export async function load({ params }) {
	const post = getPostBySlug(params.slug);
	if (!post) throw error(404, 'Post not found');

	const { header, body } = splitHeader(post.content);
	return { slug: post.slug, header, content: body, tags: post.tags };
}

export const actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		const header = data.get('header')?.toString() ?? '';
		const rawContent = data.get('content')?.toString() ?? '';
		const tags = data.get('tags')?.toString() ?? '';

		if (!rawContent.trim()) {
			return fail(400, { error: 'Content is required', header, content: rawContent, tags });
		}

		const existing = getPostBySlug(params.slug);
		if (!existing) throw error(404, 'Post not found');

		const { created } = generatePostTimestamp();
		const body = withHeader(header, renderContent(rawContent));
		const tagsString = mergeTags(detectAutoTags(body), tags);
		const fileContent = buildFileContent({
			id: existing.id ?? params.slug,
			created: existing.created,
			updated: created,
			tags: tagsString,
			body
		});

		try {
			if (process.env.VERCEL) {
				await commitFile(`src/posts/${params.slug}.html`, fileContent, `Update post: ${params.slug}`);
			} else {
				writePostFileLocally(params.slug, fileContent);
			}
		} catch (err) {
			console.error('Save post error:', err);
			return fail(500, { error: err.message || 'Failed to save post', header, content: rawContent, tags });
		}

		throw redirect(303, '/cms');
	},

	delete: async ({ params }) => {
		try {
			if (process.env.VERCEL) {
				await deleteFile(`src/posts/${params.slug}.html`, `Delete post: ${params.slug}`);
			} else {
				deletePostFileLocally(params.slug);
			}
		} catch (err) {
			console.error('Delete post error:', err);
			return fail(500, { error: err.message || 'Failed to delete post' });
		}

		throw redirect(303, '/cms');
	}
};
