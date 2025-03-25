<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>LAGbag Fantasy Golf</title>
</svelte:head>

<div class="container mx-auto p-8">
	{#if data.givenName}
		<p>Welcome to Fantasy Golf, {data.givenName}!</p>
	{:else}
		<p>Welcome to Fantasy Golf! <a class="link" href="/login">Sign in</a> to get started.</p>
	{/if}
</div>
