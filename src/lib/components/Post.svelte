<script>
	import { onMount } from 'svelte';

	let { post } = $props();
	let showLightbox = $state(false);
	let lightboxSrc = $state('');
	let articleElement;

	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate(); // No leading zero
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];
		const month = monthNames[date.getMonth()];
		return `${day} ${month}`;
	}

	onMount(() => {
		// Add click handlers to all images
		const images = articleElement.querySelectorAll('img');
		images.forEach(img => {
			img.style.cursor = 'pointer';
			img.addEventListener('click', () => {
				lightboxSrc = img.src;
				showLightbox = true;
			});
		});
	});

	function closeLightbox() {
		showLightbox = false;
	}
</script>

<article bind:this={articleElement}>
	<div>{@html post.content}</div>
	<div class="date-wrapper">
		<small class="post-date">{formatDate(post.created)}</small>
	</div>
</article>

{#if showLightbox}
	<div class="lightbox" on:click={closeLightbox}>
		<img src={lightboxSrc} alt="" />
	</div>
{/if}


  <style>
        article {
                margin-bottom: 4rem;
                padding-bottom: 2rem;
                position: relative;
				/* text-align: center; */
        }

        article :global(p),
        article :global(img),
        article :global(ul),
        article :global(ol),
        article :global(blockquote),
        article :global(center) {
                margin-bottom: 1rem;
        }

        article :global(p:last-child),
        article :global(img:last-child),
        article :global(ul:last-child),
        article :global(ol:last-child),
        article :global(blockquote:last-child),
        article :global(center:last-child) {
                margin-bottom: 0;
        }

        .date-wrapper {
                text-align: center;
                margin-top: 1rem;
        }

        .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: pointer;
        }

        .lightbox img {
                max-width: 95%;
                max-height: 95vh;
                border: none;
                margin: 0;
        }
  </style>