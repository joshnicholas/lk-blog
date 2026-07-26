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
