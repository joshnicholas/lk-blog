<script>
	import Post from '$lib/components/Post.svelte';

	export let data;
</script>

{#if data.posts.length === 0}
	<p>No posts yet. Check back soon!</p>
{:else}
	<div style="padding-top: 2em;">
		{#each data.posts as post}
			<Post {post} />
		{/each}
	</div>
{/if}
