<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const ownedLeagues: [League?] = data.ownedLeagues;
	const joinedLeagues: [League?] = data.joinedLeagues;
</script>

<svelte:head>
	<title>My Leagues</title>
</svelte:head>

{#if ownedLeagues.length === 0 && joinedLeagues.length === 0}
	<div class="container p-8">
		<h3 class="h3 pb-4">You don't have any leagues yet!</h3>
		<div class="grid grid-cols-2 gap-4">
			<a class="btn variant-ringed" href="/leagues/join">Join a League</a>
			<a class="btn variant-filled" href="/leagues/create">Create a League</a>
		</div>
	</div>
{/if}

<div class="container p-8">
	<div class="container pb-8">
		<h2 class="h2 pb-8">My Leagues</h2>
		<ul class="pb-8">
			{#each ownedLeagues as league}
				<li class="pb-2">
					<a href="/leagues/{league?._id}" class="btn variant-ringed w-1/2">{league?.league_name}</a
					>
					<p class="inline-flex pl-12">Join Code: {league?.join_code}</p>
				</li>
			{/each}
		</ul>
	</div>
	<div class="container pb-8">
		<h2 class="h2 pb-8">Joined Leagues</h2>
		<ul>
			{#each joinedLeagues as league}
				<li>
					<a href="/leagues/{league?._id}" class="btn variant-ringed w-full"
						>{league?.league_name}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
