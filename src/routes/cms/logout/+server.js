import { redirect } from '@sveltejs/kit';
import { CMS_COOKIE_NAME } from '$lib/server/auth.js';

export async function GET({ cookies }) {
	cookies.delete(CMS_COOKIE_NAME, { path: '/' });
	throw redirect(303, '/cms/login');
}
