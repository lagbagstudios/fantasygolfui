<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<div class="container mx-auto p-8 space-y-8">
	{#if data.givenName}
		<p>Welcome to Fantasy Golf, {data.givenName}!</p>
	{:else}
		<p>Welcome to Fantasy Golf! <a href="/login">Sign in</a> to get started.</p>
	{/if}
</div>
