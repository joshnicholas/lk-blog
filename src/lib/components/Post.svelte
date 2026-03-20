<script>
	let { post, isLast = false } = $props();

	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate(); // No leading zero
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];
		const month = monthNames[date.getMonth()];
		return `${day} ${month}`;
	}
</script>

<article class:fade-out={isLast}>
	<div>{@html post.content}</div>
	<div class="date-wrapper">
		<small class="post-date">{formatDate(post.created)}</small>
	</div>
</article>


  <style>
        article {
                margin-bottom: 4rem;
                padding-bottom: 2rem;
                position: relative;
				/* text-align: center; */
        }

        article.fade-out {
                max-height: 15rem;
                overflow: hidden;
                margin-bottom: 0;
                mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
                -webkit-mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
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

  </style>