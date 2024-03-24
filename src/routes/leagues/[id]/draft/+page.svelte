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

<div class="container p-8 sm:flex">
	<h1 class="h1 pb-8 sm:pb-0 text-center sm:text-left sm:inline-flex sm:w-full">Draft Board</h1>
	<a href="/leagues/{leagueId}" class="btn variant-ghost w-full sm:w-auto sm:float-right"
		>Return to League Home</a
	>
</div>

<h4 class="h4 text-center pb-8">Budget Remaining: ${remainingBudget}</h4>

<div class="overflow-scroll w-full">
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
						<td>{golfer?.price}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="container grid grid-cols-2">
	<button>test</button>
	<button>reset</button>
</div>
