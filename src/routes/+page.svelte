<script>
	import Post from '$lib/components/Post.svelte';

	export let data;

	let allPosts = data.posts || [];
	let currentPage = 0;
	const postsPerPage = 5;

	$: totalPages = Math.ceil(allPosts.length / postsPerPage);
	$: displayedPosts = allPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);
	$: hasPrev = currentPage > 0;
	$: hasNext = currentPage < totalPages - 1;

	function goToPrev() {
		if (hasPrev) {
			currentPage--;
			window.scrollTo(0, 0);
		}
	}

	function goToNext() {
		if (hasNext) {
			currentPage++;
			window.scrollTo(0, 0);
		}
	}
</script>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 2.5rem - 40px);
	}

	.posts-content {
		flex: 1;
		padding-top: 2em;
	}

	.pagination-top {
		padding-bottom: 20px;
	}

	.pagination-bottom {
		margin-top: auto;
	}
</style>

{#if allPosts.length === 0}
	<p>No posts yet. Check back soon!</p>
{:else}
	<div class="page-container">
	<div class="pagination-top flex justify-between">
		{#if hasPrev}
			<button
				class="cursor-pointer hover:opacity-70 select-none font-medium"
				style="background: none; border: none; padding: 0; color: #8F91FF;"
				on:click={goToPrev}
			>
				Prev
			</button>
		{:else}
			<span></span>
		{/if}
		{#if hasNext}
			<button
				class="cursor-pointer hover:opacity-70 select-none font-medium"
				style="background: none; border: none; padding: 0; color: #8F91FF;"
				on:click={goToNext}
			>
				Next
			</button>
		{:else}
			<span></span>
		{/if}
	</div>

	<div class="posts-content">
		{#each displayedPosts as post}
			<Post {post} />
		{/each}
	</div>

	<div class="pagination-bottom flex justify-between">
		{#if hasPrev}
			<button
				class="cursor-pointer hover:opacity-70 select-none font-medium"
				style="background: none; border: none; padding: 0; color: #8F91FF;"
				on:click={goToPrev}
			>
				Prev
			</button>
		{:else}
			<span></span>
		{/if}
		{#if hasNext}
			<button
				class="cursor-pointer hover:opacity-70 select-none font-medium"
				style="background: none; border: none; padding: 0; color: #8F91FF;"
				on:click={goToNext}
			>
				Next
			</button>
		{:else}
			<span></span>
		{/if}
	</div>
	</div>
{/if}
