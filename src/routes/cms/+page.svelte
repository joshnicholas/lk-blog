<script>
	let { data } = $props();

	function snippet(html) {
		const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		return text.length > 120 ? text.slice(0, 120) + '…' : text;
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleString('en-AU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>CMS</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Posts</h1>
		<div class="flex gap-4">
			<a href="/cms/new">New post</a>
			<a href="/cms/logout">Logout</a>
		</div>
	</div>

	<div class="flex flex-col gap-3">
		{#each data.posts as post (post.slug)}
			<a href="/cms/{post.slug}/edit" class="block post-row p-3 no-underline">
				<div class="flex items-center justify-between text-sm font-bold">
					<span>{formatDate(post.created)}</span>
					{#if post.tags}<span class="font-normal">{post.tags}</span>{/if}
				</div>
				<div class="mt-1">{snippet(post.content)}</div>
			</a>
		{:else}
			<p>No posts yet.</p>
		{/each}
	</div>
</div>

<style>
	a.block {
		color: inherit;
	}

	.post-row {
		border: 1px solid currentColor;
	}
</style>
