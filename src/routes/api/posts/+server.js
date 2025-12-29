import { json } from '@sveltejs/kit';
import { getAllPosts, savePost, verifyAuth } from '$lib/posts.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';
import matter from 'gray-matter';

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

async function savePostViaGitHub(post) {
	const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

	const slug = post.slug || post.id;
	const filepath = `src/posts/${slug}.html`;

	const frontmatter = {
		id: post.id,
		created: post.created,
		updated: post.updated,
		tags: post.tags || ''
	};

	const fileContent = matter.stringify(post.content, frontmatter);
	const contentBase64 = Buffer.from(fileContent).toString('base64');

	try {
		// Try to get existing file (for updates)
		let sha;
		try {
			const { data } = await octokit.rest.repos.getContent({
				owner: env.GITHUB_OWNER,
				repo: env.GITHUB_REPO,
				path: filepath,
			});
			sha = data.sha;
		} catch (e) {
			// File doesn't exist, that's ok for new posts
		}

		// Create or update file
		await octokit.rest.repos.createOrUpdateFileContents({
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			path: filepath,
			message: `Add post: ${post.id}`,
			content: contentBase64,
			sha: sha,
			branch: 'main'
		});

		return { success: true, slug };
	} catch (error) {
		console.error('GitHub API error:', error);
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
		// Check if running on Vercel (has VERCEL env var)
		const isVercel = !!process.env.VERCEL;

		if (isVercel) {
			// Use GitHub API
			const result = await savePostViaGitHub(post);
			return json({
				success: result.success,
				slug: result.slug,
				gitPushed: result.success,
				method: 'github-api'
			});
		} else {
			// Use local filesystem + git
			const savedSlug = savePost(post);
			const gitResult = await gitCommitAndPush(`Add post: ${post.id}`);
			return json({
				success: true,
				slug: savedSlug,
				gitPushed: gitResult.success,
				method: 'local-git'
			});
		}
	} catch (error) {
		console.error('Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
