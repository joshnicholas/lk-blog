import { redirect } from '@sveltejs/kit';
import { CMS_COOKIE_NAME, isValidSession } from '$lib/server/auth.js';

export async function load({ cookies, url }) {
	const authed = isValidSession(cookies.get(CMS_COOKIE_NAME));

	if (!authed && url.pathname !== '/cms/login') {
		throw redirect(303, '/cms/login');
	}
	if (authed && url.pathname === '/cms/login') {
		throw redirect(303, '/cms');
	}

	return { authed };
}
