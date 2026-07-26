<script>
	import { enhance } from '$app/forms';
	import CmsEditor from '$lib/components/CmsEditor.svelte';

	let { data, form } = $props();

	let header = $state(form?.header ?? data.header);
	let content = $state(form?.content ?? data.content);
	let tags = $state(form?.tags ?? data.tags);
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Edit post</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Edit post</h1>
		<a href="/cms">Back</a>
	</div>

	{#if form?.error}
		<div class="p-2 bg-red-200 text-black">{form.error}</div>
	{/if}

	<form
		method="POST"
		action="?/save"
		class="flex flex-col gap-3"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
	>
		<CmsEditor bind:header bind:content bind:tags />
		<div class="flex gap-3">
			<button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
		</div>
	</form>

	<form
		method="POST"
		action="?/delete"
		use:enhance={({ cancel }) => {
			if (!confirm('Delete this post? This cannot be undone.')) cancel();
		}}
	>
		<button type="submit" class="bg-red-700">Delete post</button>
	</form>
</div>
