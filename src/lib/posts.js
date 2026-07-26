import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const POSTS_DIR = 'src/posts';

// Shared by the local-fs reader below and $lib/server/postsRemote.js (GitHub API reader)
export function parsePostFile(filename, fileContent) {
	const { data, content } = matter(fileContent);

	return {
		id: data.id,
		content: content,
		created: data.created,
		updated: data.updated,
		slug: filename.replace('.html', ''),
		tags: data.tags || ''
	};
}

// Filenames are DDMMYYYYHHMMSS — parse to Date for correct sort order
export function filenameToDate(filename) {
	const name = filename.replace('.html', '');
	const dd = name.slice(0, 2), mm = name.slice(2, 4), yyyy = name.slice(4, 8);
	const hh = name.slice(8, 10), min = name.slice(10, 12), ss = name.slice(12, 14);
	return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`);
}

function readPostFile(file) {
	const fileContent = readFileSync(join(POSTS_DIR, file), 'utf-8');
	return parsePostFile(file, fileContent);
}

function sortedFiles() {
	if (!existsSync(POSTS_DIR)) return [];
	return readdirSync(POSTS_DIR)
		.filter(file => file.endsWith('.html'))
		.sort((a, b) => filenameToDate(b) - filenameToDate(a));
}

// Local filesystem only: works at build time (prerendering) and in local dev.
// On Vercel at request time (e.g. /cms), src/posts isn't present in the deployed
// function — use $lib/server/postsRemote.js instead.
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

	return readPostFile(`${slug}.html`);
}

// fileContent must already include YAML frontmatter (see $lib/server/postEditor.js)
export function writePostFileLocally(slug, fileContent) {
	writeFileSync(join(POSTS_DIR, `${slug}.html`), fileContent);
}

export function deletePostFileLocally(slug) {
	const filePath = join(POSTS_DIR, `${slug}.html`);
	if (existsSync(filePath)) unlinkSync(filePath);
}
