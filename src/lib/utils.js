export function createPostId() {
	return new Date().toLocaleString('en-AU', {
		timeZone: 'Australia/Melbourne',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	}).replace(/[^\d]/g, '');
}
