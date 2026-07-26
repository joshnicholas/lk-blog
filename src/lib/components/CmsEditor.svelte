<script>
	import { tick } from 'svelte';

	let { header = $bindable(''), content = $bindable(''), tags = $bindable('') } = $props();

	let textareaEl;
	let fileInput;
	let fileLabel = $state('');
	let uploadStatus = $state('');
	let uploadStatusOk = $state(true);
	let uploading = $state(false);

	async function setSelection(start, end) {
		await tick();
		textareaEl.focus();
		textareaEl.setSelectionRange(start, end);
	}

	async function insertAtCursor(text, cursorOffset) {
		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;
		content = content.slice(0, start) + text + content.slice(end);
		await setSelection(start + cursorOffset, start + cursorOffset);
	}

	async function insertTag(tag) {
		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;
		const selected = content.slice(start, end);

		let insertion = '';
		let cursorOffset = 0;

		if (tag === 'b') {
			insertion = `**${selected}**`;
			cursorOffset = selected ? insertion.length : 2;
		} else if (tag === 'i') {
			insertion = `*${selected}*`;
			cursorOffset = selected ? insertion.length : 1;
		} else if (tag === 'a') {
			insertion = `[${selected}]()`;
			cursorOffset = selected ? selected.length + 3 : 1;
		} else if (tag === 's') {
			insertion = `~~${selected}~~`;
			cursorOffset = selected ? insertion.length : 2;
		} else if (tag === 'blockquote') {
			insertion = `> ${selected}`;
			cursorOffset = insertion.length;
		} else if (tag === 'li') {
			insertion = `- ${selected}`;
			cursorOffset = insertion.length;
		} else if (tag === 'center') {
			insertion = `<center>${selected}</center>`;
			cursorOffset = selected ? insertion.length : 8;
		} else if (tag === 'h') {
			insertion = `<p class="boldy">${selected}</p>`;
			cursorOffset = selected ? insertion.length : 16;
		} else if (tag === 'ha') {
			const href = await navigator.clipboard.readText().catch(() => '');
			insertion = `<p class="boldy"><a href="${href}">${selected}</a></p>`;
			cursorOffset = selected ? insertion.length : 16 + href.length + 9;
		}

		const newStart = start;
		content = content.slice(0, start) + insertion + content.slice(end);
		await setSelection(newStart + cursorOffset, newStart + cursorOffset);
	}

	function compressImage(file, maxDimension = 1800, quality = 0.85) {
		return new Promise((resolve) => {
			const img = new Image();
			const url = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(url);
				let { width, height } = img;
				if (width > maxDimension || height > maxDimension) {
					const scale = Math.min(maxDimension / width, maxDimension / height);
					width = Math.round(width * scale);
					height = Math.round(height * scale);
				}
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(img, 0, 0, width, height);
				canvas.toBlob(resolve, 'image/jpeg', quality);
			};
			img.src = url;
		});
	}

	function onFileChange() {
		fileLabel = fileInput.files[0] ? fileInput.files[0].name : '';
	}

	async function uploadImage() {
		const file = fileInput.files[0];
		if (!file) {
			alert('Please choose an image first');
			return;
		}

		uploading = true;
		uploadStatusOk = true;
		uploadStatus = 'Compressing...';

		const compressed = await compressImage(file);

		uploadStatus = 'Uploading...';

		const formData = new FormData();
		formData.append('file', compressed, file.name);

		try {
			const response = await fetch('/cms/upload', { method: 'POST', body: formData });
			const result = await response.json();

			if (response.ok && result.success) {
				const dimAttr = result.width && result.height ? ` width="${result.width}" height="${result.height}"` : '';
				const img = `\n\n<img src="${result.url}" alt="${file.name}"${dimAttr} />\n\n`;
				await insertAtCursor(img, img.length);
				fileInput.value = '';
				fileLabel = '';
				uploadStatus = `Uploaded: ${result.url}`;
				uploadStatusOk = true;
			} else {
				uploadStatus = 'Upload failed: ' + (result.error || 'Unknown error');
				uploadStatusOk = false;
			}
		} catch (err) {
			uploadStatus = 'Upload failed: ' + err.message;
			uploadStatusOk = false;
		}

		uploading = false;
		setTimeout(() => {
			uploadStatus = '';
		}, 5000);
	}
</script>

<div class="flex items-center gap-3">
	<input bind:this={fileInput} type="file" accept="image/*" class="hidden" onchange={onFileChange} />
	<button type="button" onclick={() => fileInput.click()}>Choose image</button>
	<button type="button" onclick={uploadImage} disabled={uploading}>
		{uploading ? 'Uploading...' : 'Upload & Insert'}
	</button>
	<span>{fileLabel}</span>
</div>

{#if uploadStatus}
	<div class="p-2" class:bg-red-200={!uploadStatusOk} class:bg-green-200={uploadStatusOk}>
		{uploadStatus}
	</div>
{/if}

<div class="flex gap-3">
	<button type="button" onclick={() => insertTag('b')}>b</button>
	<button type="button" onclick={() => insertTag('i')}>i</button>
	<button type="button" onclick={() => insertTag('a')}>a</button>
	<button type="button" onclick={() => insertTag('s')}>sr</button>
	<button type="button" onclick={() => insertTag('blockquote')}>q</button>
	<button type="button" onclick={() => insertTag('li')}>li</button>
	<button type="button" onclick={() => insertTag('center')}>c</button>
	<button type="button" onclick={() => insertTag('h')}>h</button>
	<button type="button" onclick={() => insertTag('ha')}>ha</button>
</div>

<input type="text" name="header" bind:value={header} placeholder="Header..." />

<textarea
	bind:this={textareaEl}
	name="content"
	required
	style="height: 340px; resize: none; overflow-y: auto;"
	placeholder="Main text (markdown)..."
	bind:value={content}
></textarea>

<input type="text" name="tags" bind:value={tags} placeholder="Tags..." />

<style>
	.hidden {
		display: none;
	}
</style>
