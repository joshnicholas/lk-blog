import { json } from '@sveltejs/kit';
import { verifyAuth } from '$lib/posts.js';
import sharp from 'sharp';
import { env } from '$env/dynamic/private';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Octokit } from 'octokit';

async function saveImageViaGitHub(buffer, processedBuffer, timestamp, extension) {
	const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

	const rawFilename = `${timestamp}.${extension}`;
	const processedFilename = `${timestamp}.webp`;
	const rawPath = `static/uploads/raw/${rawFilename}`;
	const processedPath = `static/uploads/${processedFilename}`;

	try {
		// Upload raw version
		await octokit.rest.repos.createOrUpdateFileContents({
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			path: rawPath,
			message: `Upload image: ${rawFilename}`,
			content: buffer.toString('base64'),
			branch: 'main'
		});

		// Upload processed version
		await octokit.rest.repos.createOrUpdateFileContents({
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			path: processedPath,
			message: `Upload processed image: ${processedFilename}`,
			content: processedBuffer.toString('base64'),
			branch: 'main'
		});

		return {
			success: true,
			url: `/uploads/${processedFilename}`,
			filename: processedFilename
		};
	} catch (error) {
		console.error('GitHub upload error:', error);
		return { success: false, error: error.message };
	}
}

function saveImageLocally(buffer, processedBuffer, timestamp, extension) {
	const rawDir = 'static/uploads/raw';
	if (!existsSync(rawDir)) {
		mkdirSync(rawDir, { recursive: true });
	}

	const rawFilename = `${timestamp}.${extension}`;
	const processedFilename = `${timestamp}.webp`;
	const rawPath = join(rawDir, rawFilename);
	const processedPath = join('static/uploads', processedFilename);

	writeFileSync(rawPath, buffer);
	writeFileSync(processedPath, processedBuffer);

	return {
		success: true,
		url: `/uploads/${processedFilename}`,
		filename: processedFilename
	};
}

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

		const timestamp = Date.now();
		const extension = file.name.split('.').pop();

		// Get file buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Process image with Sharp
		const processedBuffer = await sharp(buffer)
			.resize(1200, 1200, {
				fit: 'inside',
				withoutEnlargement: true
			})
			.webp({ quality: 85 })
			.toBuffer();

		// Check if running on Vercel
		const isVercel = !!process.env.VERCEL;

		let result;
		if (isVercel) {
			// Use GitHub API
			result = await saveImageViaGitHub(buffer, processedBuffer, timestamp, extension);
		} else {
			// Use local filesystem
			result = saveImageLocally(buffer, processedBuffer, timestamp, extension);
		}

		if (!result.success) {
			return json({ error: result.error }, { status: 500 });
		}

		return json({
			success: true,
			url: result.url,
			filename: result.filename
		});
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
