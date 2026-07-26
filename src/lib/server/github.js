import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';

function client() {
	return new Octokit({ auth: env.GITHUB_TOKEN });
}

// content: Buffer or string
export async function commitFile(path, content, message) {
	const octokit = client();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;

	let sha;
	try {
		const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
		sha = Array.isArray(data) ? undefined : data.sha;
	} catch (err) {
		if (err.status !== 404) throw err;
	}

	const base64 = Buffer.isBuffer(content) ? content.toString('base64') : Buffer.from(content).toString('base64');

	await octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		path,
		message,
		content: base64,
		sha,
		branch: 'main'
	});
}

// Lists files in a directory (name + download_url), no content
export async function listDirectory(path) {
	const octokit = client();
	const { data } = await octokit.rest.repos.getContent({
		owner: env.GITHUB_OWNER,
		repo: env.GITHUB_REPO,
		path
	});
	return Array.isArray(data) ? data : [];
}

export async function getFileContent(path) {
	const octokit = client();
	try {
		const { data } = await octokit.rest.repos.getContent({
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			path
		});
		if (Array.isArray(data) || !data.content) throw new Error(`${path} is not a file`);
		return Buffer.from(data.content, 'base64').toString('utf-8');
	} catch (err) {
		if (err.status === 404) return null;
		throw err;
	}
}

export async function deleteFile(path, message) {
	const octokit = client();
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;

	const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
	await octokit.rest.repos.deleteFile({
		owner,
		repo,
		path,
		message,
		sha: data.sha,
		branch: 'main'
	});
}
