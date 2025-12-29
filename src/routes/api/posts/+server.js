import { json } from '@sveltejs/kit';
import { getAllPosts, savePost, verifyAuth } from '$lib/posts.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function gitCommitAndPush(message) {
	try {
		await execAsync('git add src/posts');
		await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`);
		await execAsync('git push');
		return { success: true };
	} catch (error) {
		console.error('Git error:', error);
		return { success: false, error: error.message };
	}
}

export async function GET() {
	const posts = getAllPosts();
	return json({ posts });
}

export async function POST({ request }) {
	const { post, username, password } = await request.json();

	if (!verifyAuth(username, password)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const savedSlug = savePost(post);
		const gitResult = await gitCommitAndPush(`Add post: ${post.id}`);

		return json({
			success: true,
			slug: savedSlug,
			gitPushed: gitResult.success
		});
	} catch (error) {
		console.error('Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
