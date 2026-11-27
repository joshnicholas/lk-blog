<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/nav.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const defaultDescription = 'Josh Nicholas is a journalist and scribbler';
</script>


<svelte:head>
	<title>{page.data?.title ? `${page.data.title} — Josh Nicholas` : 'Josh Nicholas'}</title>
	<meta name="description" content={page.data?.description || defaultDescription} />
	<meta name="keywords" content="Josh Nicholas,data journalist,interactive journalist,watercolour,scribble and wash,drawing,sketching,interactive artist,visual journalist,data visualization,scribbles,scribbler,Guardian,Guardian Australia,The Guardian,2ser,The Wire,The Conversation">
	<link rel="alternate" type="application/rss+xml" title="Josh Nicholas RSS Feed" href="/feed" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": "https://joshnicholas.blog/#person",
		"name": "Josh Nicholas",
		"url": "https://joshnicholas.blog",
		"jobTitle": "Journalist",
		"worksFor": {
			"@type": "Organization",
			"name": "ABC News",
			"url": "https://www.abc.net.au/news"
		},
		"sameAs": [
			"https://joshnicholas.blog",
			"https://joshnicholas.com",
			"https://www.abc.net.au/news/josh-nicholas/107294250",
			"https://www.instagram.com/joshcnicholas/"
		]
	})}</script>`}
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


