<script>
	import Post from '$lib/components/Post.svelte';

	export let data;
</script>

<style>
	.single-post {
		padding-top: 2em;
	}
</style>

<div class="single-post">
	<Post post={data.post} />
</div>
