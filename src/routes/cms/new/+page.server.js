import { fail, redirect } from '@sveltejs/kit';
import { writePostFileLocally } from '$lib/posts.js';
import { commitFile } from '$lib/server/github.js';
import {
	generatePostTimestamp,
	renderContent,
	withHeader,
	detectAutoTags,
	mergeTags,
	buildFileContent
} from '$lib/server/postEditor.js';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const header = data.get('header')?.toString() ?? '';
		const rawContent = data.get('content')?.toString() ?? '';
		const tags = data.get('tags')?.toString() ?? '';

		if (!rawContent.trim()) {
			return fail(400, { error: 'Content is required', header, content: rawContent, tags });
		}

		const { id, created } = generatePostTimestamp();
		const body = withHeader(header, renderContent(rawContent));
		const tagsString = mergeTags(detectAutoTags(body), tags);
		const fileContent = buildFileContent({ id, created, updated: created, tags: tagsString, body });

		try {
			if (process.env.VERCEL) {
				await commitFile(`src/posts/${id}.html`, fileContent, `Add post: ${id}`);
			} else {
				writePostFileLocally(id, fileContent);
			}
		} catch (error) {
			console.error('Save post error:', error);
			return fail(500, { error: error.message || 'Failed to save post', header, content: rawContent, tags });
		}

		throw redirect(303, '/cms');
	}
};
