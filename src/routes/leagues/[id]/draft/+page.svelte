<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	const golfers: [Golfer?] = data?.golfers || [];
	const league: League = data?.league;

	let selectedGolferIDs: (string | undefined)[] = [];

	const onGolferSelected = (golferId: string | undefined) => {
		if (typeof golferId !== 'string') return;
		if (selectedGolferIDs.find((golfer) => golfer === golferId)) {
			selectedGolferIDs = selectedGolferIDs.filter((id) => id !== golferId);
		} else {
			selectedGolferIDs.push(golferId);
		}
		selectedGolferIDs = selectedGolferIDs;
	};

	$: selectedGolfers = golfers.filter((golfer) => selectedGolferIDs.includes(golfer?.golfer_id));

	$: remainingBudget =
		selectedGolfers &&
		(league.budget || 0) - selectedGolfers.reduce((n, { price }) => n + price, 0);

	$: leagueId = $page.params.id;
</script>

<div class="container p-8">
	<a href="/leagues/{leagueId}" class="btn variant-ghost w-full sm:w-auto sm:float-right"
		>Return to League Home</a
	>
	<h1 class="h1 pt-8 sm:pt-0 sm:ml-4 text-center sm:w-full">Draft Board</h1>
</div>

<div class="sm:flex mx-auto space-x-8 w-full p-4">
	<h2 class="h2 text-center sm:text-left">Your Team</h2>
</div>

<div class="table-container space-y-4 pb-8 sm:w-2/3 max-h-52">
	<table class="table">
		<thead>
			<tr>
				<th>Golfer</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			{#each selectedGolfers as golfer}
				<tr on:click={() => onGolferSelected(golfer?.golfer_id)}>
					<td>{golfer?.first_name} {golfer?.last_name}</td>
					<td>${golfer?.price}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th>Budget Remaining</th>
				<td>${remainingBudget}</td>
			</tr>
		</tfoot>
	</table>
</div>

<div class="sm:flex mx-auto space-x-8 w-full p-4">
	<h2 class="h2 text-center sm:text-left">Tournament Field</h2>
</div>

<div class="overflow-scroll w-full max-h-96">
	<div class="table-container">
		<table class="table table-interactive">
			<thead>
				<tr>
					<th>Golfer</th>
					<th>Ranking</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>
				{#each golfers as golfer}
					<tr
						class:table-row-checked={selectedGolferIDs.includes(golfer?.golfer_id)}
						on:click={() => onGolferSelected(golfer?.golfer_id)}
					>
						<td>{golfer?.first_name} {golfer?.last_name}</td>
						<td>{golfer?.owgr || 'Unranked'}</td>
						<td>${golfer?.price}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
