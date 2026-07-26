import { json } from '@sveltejs/kit';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import sharp from 'sharp';
import { CMS_COOKIE_NAME, isValidSession } from '$lib/server/auth.js';
import { commitFile } from '$lib/server/github.js';

const MAX_DIMENSION = 600;
const WEBP_QUALITY = 72;
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST({ request, cookies }) {
	if (!isValidSession(cookies.get(CMS_COOKIE_NAME))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const image = sharp(Buffer.from(arrayBuffer)).rotate();

		const resized = image.resize(MAX_DIMENSION, MAX_DIMENSION, {
			fit: 'inside',
			withoutEnlargement: true
		});

		const { data: buffer, info } = await resized.webp({ quality: WEBP_QUALITY }).toBuffer({ resolveWithObject: true });

		if (buffer.length > MAX_BYTES) {
			return json({ error: 'Image too large after compression (max 5MB)' }, { status: 400 });
		}

		const filename = `${Date.now()}.webp`;
		const isVercel = !!process.env.VERCEL;

		if (isVercel) {
			await commitFile(`static/uploads/${filename}`, buffer, `Add image: ${filename}`);
		} else {
			const dir = 'static/uploads';
			if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
			writeFileSync(`${dir}/${filename}`, buffer);
		}

		return json({ success: true, url: `/uploads/${filename}`, width: info.width, height: info.height });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: error.message || 'Upload failed' }, { status: 500 });
	}
}
