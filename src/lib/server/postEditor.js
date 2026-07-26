import { marked } from 'marked';

const TIMEZONE = 'Australia/Melbourne';

function melbourneParts(date) {
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat('en-CA', {
			timeZone: TIMEZONE,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		})
			.formatToParts(date)
			.map((p) => [p.type, p.value])
	);
	// ICU quirk: hour12:false can yield "24" instead of "00" for midnight
	if (parts.hour === '24') parts.hour = '00';
	return parts;
}

function melbourneOffset(date) {
	const tzName = new Intl.DateTimeFormat('en-US', {
		timeZone: TIMEZONE,
		timeZoneName: 'shortOffset'
	})
		.formatToParts(date)
		.find((p) => p.type === 'timeZoneName').value; // e.g. "GMT+10" or "GMT+11"

	const match = tzName.match(/GMT([+-]\d+)/);
	const hours = match ? parseInt(match[1], 10) : 10;
	const sign = hours >= 0 ? '+' : '-';
	return `${sign}${String(Math.abs(hours)).padStart(2, '0')}:00`;
}

// Matches createPostId() convention used site-wide: DDMMYYYYHHmmss, Melbourne local time
export function generatePostTimestamp(date = new Date()) {
	const p = melbourneParts(date);
	const id = `${p.day}${p.month}${p.year}${p.hour}${p.minute}${p.second}`;
	const ms = String(date.getMilliseconds()).padStart(3, '0');
	const created = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.${ms}${melbourneOffset(date)}`;
	return { id, created };
}

export function detectAutoTags(bodyHtml) {
	const tags = [];
	if (bodyHtml.includes('<img')) tags.push('image');
	if (bodyHtml.includes('<blockquote')) tags.push('quote');
	if (bodyHtml.includes('<a ')) tags.push('link');
	return tags;
}

export function mergeTags(autoTags, manualTagsString) {
	const manual = (manualTagsString || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
	return [...new Set([...autoTags, ...manual])].join(', ');
}

// Always runs through marked: embedded HTML tags (e.g. <img>, <a>) pass through
// untouched on their own, while markdown syntax (links, bold, etc.) still gets
// converted. Do not special-case content that merely starts with '<' — that
// previously skipped markdown parsing for the whole post whenever an image was
// inserted first, silently leaving any [markdown](links) unconverted.
export function renderContent(raw) {
	const trimmed = (raw || '').trim();
	if (!trimmed) return '';
	return marked.parse(trimmed, { breaks: true }).trim();
}

export function withHeader(header, body) {
	const trimmedHeader = (header || '').trim();
	return trimmedHeader ? `<p class="header">${trimmedHeader}</p>\n${body}` : body;
}

// Reproduces the exact frontmatter format used by every existing post file
export function buildFileContent({ id, created, updated, tags, body }) {
	return `---\nid: '${id}'\ncreated: '${created}'\nupdated: '${updated}'\ntags: '${tags}'\n---\n${body}\n`;
}

const HEADER_RE = /^<p class="header">(.*?)<\/p>\s*/;

// Splits a saved post's content back into {header, body} for editing
export function splitHeader(content) {
	const match = content.match(HEADER_RE);
	if (!match) return { header: '', body: content };
	return { header: match[1], body: content.slice(match[0].length) };
}
