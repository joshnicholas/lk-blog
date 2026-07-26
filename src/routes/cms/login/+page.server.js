import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import {
	verifyCredentials,
	createSessionCookieValue,
	CMS_COOKIE_NAME,
	CMS_SESSION_MAX_AGE
} from '$lib/server/auth.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!verifyCredentials(username, password)) {
			return fail(401, { error: 'Invalid username or password' });
		}

		cookies.set(CMS_COOKIE_NAME, createSessionCookieValue(), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: CMS_SESSION_MAX_AGE
		});

		throw redirect(303, '/cms');
	}
};
