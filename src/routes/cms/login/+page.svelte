<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>CMS Login</title>
</svelte:head>

<div class="flex flex-col gap-4 mt-10">
	<h1 class="text-xl font-bold">CMS Login</h1>

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
		<input type="text" name="username" placeholder="Username" autocomplete="username" required />
		<input
			type="password"
			name="password"
			placeholder="Password"
			autocomplete="current-password"
			required
		/>
		<button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
	</form>
</div>
