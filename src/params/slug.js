export function match(param) {
	// Exclude these routes from being treated as slugs
	const excluded = ['feed', 'post', 'api'];
	return !excluded.includes(param);
}
