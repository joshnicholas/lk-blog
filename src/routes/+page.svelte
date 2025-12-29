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
		min-height: 100%;
	}

	.posts-content {
		flex: 1;
	}
</style>

{#if allPosts.length === 0}
	<p>No posts yet. Check back soon!</p>
{:else}
	<div class="page-container">
	<div class="flex justify-between" style="padding-bottom: 20px;">
		<button
			class="cursor-pointer hover:opacity-70 select-none font-medium"
			style="background: none; border: none; padding: 0; color: #1abcc0;"
			on:click={goToPrev}
			disabled={!hasPrev}
		>
			Prev
		</button>
		<button
			class="cursor-pointer hover:opacity-70 select-none font-medium"
			style="background: none; border: none; padding: 0; color: #1abcc0;"
			on:click={goToNext}
			disabled={!hasNext}
		>
			Next
		</button>
	</div>

	<div class="posts-content">
		{#each displayedPosts as post}
			<Post {post} />
		{/each}
	</div>

	<div class="flex justify-between">
		<button
			class="cursor-pointer hover:opacity-70 select-none font-medium"
			style="background: none; border: none; padding: 0; color: #1abcc0;"
			on:click={goToPrev}
			disabled={!hasPrev}
		>
			Prev
		</button>
		<button
			class="cursor-pointer hover:opacity-70 select-none font-medium"
			style="background: none; border: none; padding: 0; color: #1abcc0;"
			on:click={goToNext}
			disabled={!hasNext}
		>
			Next
		</button>
	</div>
	</div>
{/if}
