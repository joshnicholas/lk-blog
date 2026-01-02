<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/nav.svelte';

	let { children } = $props();
</script>


<svelte:head>
	<title>Josh Nicholas</title>
	<meta name="description" content="Josh Nicholas is a journalist and scribbler" />
	<meta name="keywords" content="Josh Nicholas,data journalist,interactive journalist,watercolour,scribble and wash,drawing,sketching,interactive artist,visual journalist,data visualization,scribbles,scribbler,Guardian,Guardian Australia,The Guardian,2ser,The Wire,The Conversation">
	<link rel="alternate" type="application/rss+xml" title="Josh Nicholas RSS Feed" href="/feed" />
</svelte:head>

<div class='p-5'>

	<div class="mx-auto max-w-[600px] w-full flex flex-col" style="min-height: calc(100vh - 2.5rem);">

		<div class="flex-1">
			{@render children()}
		</div>

		<Nav />
	</div>
	



</div>


<!-- <svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head> -->


