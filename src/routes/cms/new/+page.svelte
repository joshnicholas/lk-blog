<script>
	import { enhance } from '$app/forms';
	import CmsEditor from '$lib/components/CmsEditor.svelte';

	let { form } = $props();

	let header = $state(form?.header ?? '');
	let content = $state(form?.content ?? '');
	let tags = $state(form?.tags ?? '');
	let submitting = $state(false);
</script>

<svelte:head>
	<title>New post</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">New post</h1>
		<a href="/cms">Back</a>
	</div>

	{#if form?.error}
		<div class="p-2 bg-red-200 text-black">{form.error}</div>
	{/if}

	<form
		method="POST"
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
		<button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Post'}</button>
	</form>
</div>
