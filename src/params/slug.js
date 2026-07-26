export function match(param) {
	// Exclude these routes from being treated as slugs
	const excluded = ['feed', 'api', 'cms'];
	return !excluded.includes(param);
}
