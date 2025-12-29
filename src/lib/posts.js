import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { env } from '$env/dynamic/private';

const POSTS_DIR = 'src/posts';

export function getAllPosts() {
	if (!existsSync(POSTS_DIR)) {
		return [];
	}

	const files = readdirSync(POSTS_DIR).filter(file => file.endsWith('.html'));

	const posts = files.map(file => {
		const filePath = join(POSTS_DIR, file);
		const fileContent = readFileSync(filePath, 'utf-8');
		const { data, content } = matter(fileContent);

		return {
			id: data.id,
			content: content,
			created: data.created,
			updated: data.updated,
			slug: file.replace('.html', ''),
			tags: data.tags || ''
		};
	});

	return posts.sort((a, b) => new Date(b.created) - new Date(a.created));
}

export function getPostBySlug(slug) {
	const filePath = join(POSTS_DIR, `${slug}.html`);

	if (!existsSync(filePath)) {
		return null;
	}

	const fileContent = readFileSync(filePath, 'utf-8');
	const { data, content } = matter(fileContent);

	return {
		id: data.id,
		content: content,
		created: data.created,
		updated: data.updated,
		slug,
		tags: data.tags || ''
	};
}

export function savePost(post) {
	const slug = post.slug || post.id;
	const filePath = join(POSTS_DIR, `${slug}.html`);

	const frontmatter = {
		id: post.id,
		created: post.created,
		updated: post.updated,
		tags: post.tags || ''
	};

	const fileContent = matter.stringify(post.content, frontmatter);
	writeFileSync(filePath, fileContent);

	return slug;
}

export function verifyAuth(username, password) {
	return username === env.CMS_USERNAME && password === env.CMS_PASSWORD;
}
