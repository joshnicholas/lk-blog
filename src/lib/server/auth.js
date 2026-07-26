import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const CMS_COOKIE_NAME = 'cms_session';
export const CMS_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function secret() {
	return env.CMS_PASSWORD || 'dev-secret-change-me';
}

function sign(payload) {
	return createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEqual(a, b) {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) return false;
	return timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(username, password) {
	if (!env.CMS_USERNAME || !env.CMS_PASSWORD) return false;
	if (!username || !password) return false;
	return safeEqual(username, env.CMS_USERNAME) && safeEqual(password, env.CMS_PASSWORD);
}

export function createSessionCookieValue() {
	const expires = String(Date.now() + CMS_SESSION_MAX_AGE * 1000);
	return `${expires}.${sign(expires)}`;
}

export function isValidSession(value) {
	if (!value) return false;
	const [expires, sig] = value.split('.');
	if (!expires || !sig) return false;
	if (!safeEqual(sig, sign(expires))) return false;
	return Number(expires) > Date.now();
}
