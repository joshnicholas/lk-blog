import { json } from '@sveltejs/kit';
import { verifyAuth } from '$lib/posts.js';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');
		const username = formData.get('username');
		const password = formData.get('password');

		if (!verifyAuth(username, password)) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!file || !(file instanceof File)) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Only accept images
		if (!file.type.startsWith('image/')) {
			return json({ error: 'Only image files are accepted' }, { status: 400 });
		}

		if (!env.BLOB_READ_WRITE_TOKEN) {
			return json({ error: 'Blob storage not configured' }, { status: 500 });
		}

		const timestamp = Date.now();
		const extension = file.name.split('.').pop();
		const rawFilename = `raw/${timestamp}.${extension}`;

		// Get file buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload raw version to Vercel Blob
		const rawBlob = await put(rawFilename, buffer, {
			access: 'public',
			contentType: file.type,
			token: env.BLOB_READ_WRITE_TOKEN
		});

		// Process image with Sharp
		const processedBuffer = await sharp(buffer)
			.resize(1200, 1200, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({ quality: 85 })
			.toBuffer();

		// Upload processed version to Vercel Blob
		const processedFilename = `${timestamp}.webp`;
		const processedBlob = await put(processedFilename, processedBuffer, {
			access: 'public',
			contentType: 'image/webp',
			token: env.BLOB_READ_WRITE_TOKEN
		});

		return json({
			success: true,
			url: processedBlob.url,
			filename: processedFilename,
			rawUrl: rawBlob.url
		});
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
