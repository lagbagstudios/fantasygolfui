<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const teams = data?.teams || [];
</script>

<svelte:head>
	<title>LAGbag Fantasy Golf</title>
</svelte:head>

<div class="container mx-auto p-8">
	{#if data.givenName}
		<p class="mb-8">Welcome to Fantasy Golf, {data.givenName}!</p>
		{#if teams.length > 0}
			<h3 class="h3">Your teams:</h3>
			{#each teams as team}
				<a class="btn variant-outline mt-4" href="/leagues/{team.leagueId}"
					>{team.teamName} - {team.leagueName}</a
				>
			{/each}
		{:else}
			<p>
				You don't have any teams yet. <a class="link" href="/leagues">Join a league</a> to get started!
			</p>
		{/if}
	{:else}
		<p>Welcome to Fantasy Golf! <a class="link" href="/login">Sign in</a> to get started.</p>
	{/if}
</div>
