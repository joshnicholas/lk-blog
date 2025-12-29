<script>
	import { onMount } from 'svelte';
	import { createPostId } from '$lib/utils.js';

	let posts = [];
	let content = '';
	let username = '';
	let password = '';
	let tags = '';
	let loading = false;
	let gitStatus = '';
	let uploadStatus = '';
	let fileInput;
	let selectedFileName = '';

	onMount(async () => {
		await loadPosts();
	});

	function handleFileSelect() {
		if (fileInput?.files?.[0]) {
			selectedFileName = fileInput.files[0].name;
		} else {
			selectedFileName = '';
		}
	}

	function insertTag(tag) {
		const textarea = document.getElementById('content');
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = content.substring(start, end);

		let insertion = '';
		if (tag === 'a') {
			insertion = `<a href="" target="_blank">${selectedText}</a>`;
		} else if (tag === 'ul') {
			insertion = `<ul>\n\t<li>${selectedText}</li>\n</ul>`;
		} else if (tag === 'center') {
			insertion = `<center>${selectedText}</center>`;
		} else if (tag === 's') {
			insertion = `<s>${selectedText}</s>`;
		} else if (tag === 'li') {
			insertion = `<li>${selectedText}</li>`;
		} else if (tag === 'blockquote') {
			insertion = `<blockquote>${selectedText}</blockquote>`;
		} else {
			insertion = `<${tag}>${selectedText}</${tag}>`;
		}

		content = content.substring(0, start) + insertion + content.substring(end);

		// Set cursor position after insertion
		setTimeout(() => {
			if (tag === 'a') {
				textarea.setSelectionRange(start + 9, start + 9); // Inside href=""
			} else {
				textarea.setSelectionRange(start + insertion.length, start + insertion.length);
			}
			textarea.focus();
		}, 0);
	}

	async function loadPosts() {
		try {
			const response = await fetch('/api/posts');
			if (response.ok) {
				const data = await response.json();
				posts = data.posts || [];
			}
		} catch (error) {
			console.error('Error loading posts:', error);
		}
	}

	function wrapParagraphs(html) {
		// Split by newlines and process each line
		const lines = html.split('\n');
		const processed = lines.map(line => {
			const trimmed = line.trim();
			// If line is empty or already starts with a tag, keep as-is
			if (!trimmed || trimmed.startsWith('<')) {
				return line;
			}
			// Otherwise wrap in <p> tag
			return `<p>${line}</p>`;
		});
		return processed.join('\n');
	}

	function detectTags(html) {
		const autoTags = [];
		if (html.includes('<img')) autoTags.push('image');
		if (html.includes('<blockquote')) autoTags.push('quote');
		if (html.includes('<a ')) autoTags.push('link');

		// Combine with manual tags
		const manualTags = tags.split(',').map(t => t.trim()).filter(t => t);
		const allTags = [...new Set([...autoTags, ...manualTags])];
		return allTags.join(', ');
	}

	async function addPost() {
		if (!content || !username || !password) {
			alert('Please fill in all fields');
			return;
		}

		loading = true;
		gitStatus = 'Saving and pushing to git...';

		const processedContent = wrapParagraphs(content);
		const postTags = detectTags(processedContent);

		const post = {
			id: createPostId(),
			content: processedContent,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			slug: null,
			tags: postTags
		};

		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ post, username, password })
			});

			const result = await response.json();

			if (response.ok) {
				content = '';
				tags = '';

				if (result.gitPushed) {
					gitStatus = 'Saved and pushed! Vercel will rebuild shortly.';
				} else {
					gitStatus = 'Saved locally, but git push failed. Check console.';
				}

				await loadPosts();
			} else {
				alert('Failed to save post: ' + result.error);
				gitStatus = '';
			}
		} catch (error) {
			alert('Failed to save post. Please try again.');
			gitStatus = '';
		}

		loading = false;

		setTimeout(() => {
			gitStatus = '';
		}, 5000);
	}

	async function uploadFile() {
		if (!fileInput?.files?.[0]) {
			alert('Please select a file');
			return;
		}

		if (!username || !password) {
			alert('Please enter username and password');
			return;
		}

		const file = fileInput.files[0];
		uploadStatus = 'Uploading...';

		const formData = new FormData();
		formData.append('file', file);
		formData.append('username', username);
		formData.append('password', password);

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				const htmlToInsert = `<img src="${result.url}" alt="${file.name}" />`;

				content = content + '\n' + htmlToInsert;
				uploadStatus = `Uploaded! URL: ${result.url}`;

				if (fileInput) {
					fileInput.value = '';
					selectedFileName = '';
				}
			} else {
				uploadStatus = 'Upload failed: ' + result.error;
			}
		} catch (error) {
			uploadStatus = 'Upload failed: ' + error.message;
		}

		setTimeout(() => {
			uploadStatus = '';
		}, 5000);
	}
</script>

<style>
	.file-input {
		border: none;
		padding: 0;
		width: max-content;
		color: transparent;
		font-size: 0;
	}

	.file-input::file-selector-button {
		background-color: #8479ce;
		color: white;
		border: 1px solid black;
		border-radius: 0;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1rem;
	}

	.tag-shortcut {
		background: none;
		border: none;
		padding: 0;
		color: #000;
		cursor: pointer;
		font-weight: bold;
	}
</style>

<div>
	<!-- <h1>Post Dashboard</h1> -->

	{#if gitStatus}
		<div>
			<p>{gitStatus}</p>
		</div>
	{/if}

	<div>
		<!-- <h2>Create New Post</h2> -->

		{#if uploadStatus}
			<div>
				<p>{uploadStatus}</p>
			</div>
		{/if}

		<div class="flex gap-2 mb-4 items-center">
			<input type="file" id="fileUpload" bind:this={fileInput} on:change={handleFileSelect} accept="image/*" class="file-input" />
			<button type="button" on:click={uploadFile} disabled={loading}>Upload & Insert</button>
			{#if selectedFileName}
				<span class="text-sm">{selectedFileName}</span>
			{/if}
		</div>

		<div class="flex gap-4 mb-4">
			<button type="button" on:click={() => insertTag('center')} class="tag-shortcut">c</button>
			<button type="button" on:click={() => insertTag('b')} class="tag-shortcut">b</button>
			<button type="button" on:click={() => insertTag('p')} class="tag-shortcut">p</button>
			<button type="button" on:click={() => insertTag('a')} class="tag-shortcut">a</button>
			<button type="button" on:click={() => insertTag('i')} class="tag-shortcut">i</button>
			<button type="button" on:click={() => insertTag('s')} class="tag-shortcut">sr</button>
			<button type="button" on:click={() => insertTag('li')} class="tag-shortcut">li</button>
			<button type="button" on:click={() => insertTag('ul')} class="tag-shortcut">ul</button>
			<button type="button" on:click={() => insertTag('blockquote')} class="tag-shortcut">q</button>
		</div>

		<form on:submit|preventDefault={addPost}>
			<div class="mb-4">
				<!-- <label for="content" class="block mb-2">Content (HTML):</label> -->
				<textarea id="content" bind:value={content} required disabled={loading} class="w-full" style="height: 400px; resize: none; overflow-y: auto;"></textarea>
			</div>
			<div class="mb-4">
				<label for="tags" class="block mb-2">Tags (comma-separated, auto-detected: image, quote, link):</label>
				<input type="text" id="tags" bind:value={tags} disabled={loading} class="w-full" placeholder="Optional manual tags" />
			</div>
			<div class="flex gap-4 mb-4">
				<div class="flex-1">
					<!-- <label for="username" class="block mb-2">Username:</label> -->
					<input type="text" id="username" bind:value={username} required disabled={loading} class="w-full" />
				</div>
				<div class="flex-1">
					<!-- <label for="password" class="block mb-2">Password:</label> -->
					<input type="password" id="password" bind:value={password} required disabled={loading} class="w-full" />
				</div>
				<div class="flex items-end">
					<button type="submit" disabled={loading}>Add Post</button>
				</div>
			</div>
		</form>
	</div>

	<!-- <div>
		<h2>Recent Posts</h2>
		{#if posts.length === 0}
			<p>No posts yet. Create your first post above!</p>
		{:else}
			{#each posts as post (post.id)}
				<div>
					<div>{@html post.content.substring(0, 200)}...</div>
					<small>Created: {new Date(post.created).toLocaleString()}</small>
				</div>
			{/each}
		{/if}
	</div> -->
</div>
