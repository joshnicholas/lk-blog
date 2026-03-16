import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { env } from '$env/dynamic/private';

const POSTS_DIR = 'src/posts';

function readPostFile(file) {
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
}

// Filenames are DDMMYYYYHHMMSS — parse to Date for correct sort order
function filenameToDate(filename) {
	const name = filename.replace('.html', '');
	const dd = name.slice(0, 2), mm = name.slice(2, 4), yyyy = name.slice(4, 8);
	const hh = name.slice(8, 10), min = name.slice(10, 12), ss = name.slice(12, 14);
	return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`);
}

function sortedFiles() {
	if (!existsSync(POSTS_DIR)) return [];
	return readdirSync(POSTS_DIR)
		.filter(file => file.endsWith('.html'))
		.sort((a, b) => filenameToDate(b) - filenameToDate(a));
}

export function getRecentPosts(limit = 5) {
	return sortedFiles().slice(0, limit).map(readPostFile);
}

export function getAllPosts() {
	return sortedFiles().map(readPostFile);
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
