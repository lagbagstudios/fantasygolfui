<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const ownedLeagues = data.ownedLeagues;
	const joinedLeagues = data.joinedLeagues;
</script>

<div class="container p-8">
	<div class="container pb-8">
		<h2 class="h2">My Leagues</h2>
		<p class="pb-4">Leagues you are the owner of</p>
		<ul>
			{#each ownedLeagues as league}
				<li>Name: {league.league_name}, Join Code: {league.join_code}</li>
			{/each}
		</ul>
	</div>
	<div class="container pb-8">
		<h2 class="h2">Joined Leagues</h2>
		<p class="pb-4">Leagues you have joined</p>
		<ul>
			{#each joinedLeagues as league}
				<li>Name: {league.league_name}, Join Code: {league.join_code}</li>
			{/each}
		</ul>
	</div>
</div>
