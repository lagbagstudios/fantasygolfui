<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	export let data: PageData;

	const golfers: [Golfer?] = data?.golfers || [];
	const league: League = data?.league;
	const myTeam: Team = data?.myTeam;

	let selectedGolferIDs: (string | undefined)[] = myTeam.golfers?.map((g) => g.golfer_id) || [];

	const onGolferSelected = (golfer: Golfer | undefined) => {
		if (selectedGolferIDs.find((g) => g === golfer?.golfer_id)) {
			selectedGolferIDs = selectedGolferIDs.filter((id) => id !== golfer?.golfer_id);
		} else {
			if (golfer?.price && golfer?.price > remainingBudget) {
				const t: ToastSettings = {
					message: `Not enough budget remaining for ${golfer?.first_name} ${golfer?.last_name}.`,
					timeout: 3000,
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
			} else {
				selectedGolferIDs.push(golfer?.golfer_id);
			}
		}
		selectedGolferIDs = selectedGolferIDs;
	};

	$: selectedGolfers = golfers.filter((golfer) => selectedGolferIDs.includes(golfer?.golfer_id));

	$: remainingBudget =
		selectedGolfers &&
		(league.budget || 0) - selectedGolfers.reduce((n, golfer) => n + (golfer?.price || 0), 0);

	$: leagueId = $page.params.id;
</script>

<div class="container p-8">
	<a href="/leagues/{leagueId}" class="btn variant-ghost w-full sm:w-auto sm:float-left"
		>Return to League Home</a
	>
	<h1 class="h1 pt-8 sm:pt-0 sm:ml-4 text-center sm:w-full">Draft Board</h1>
</div>

<form
	method="post"
	use:enhance={({ formData }) => {
		formData.append('golfers', JSON.stringify(selectedGolfers));

		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<div class="flex mx-auto w-full p-4">
		<h2 class="h2 w-full">Your Team</h2>
		<button
			type="submit"
			disabled={selectedGolferIDs.length < 6}
			class="btn variant-ghost-success ml-16 pl-12 pr-12">Draft Players</button
		>
	</div>
</form>

<div class="table-container space-y-4 pb-8 max-h-52 sm:max-h-screen">
	<table class="table table-interactive">
		<thead>
			<tr>
				<th>Golfer</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			{#each selectedGolfers as golfer}
				<tr on:click={() => onGolferSelected(golfer)}>
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
			<tr>
				<th>Players Drafted</th>
				<td>{selectedGolfers.length}/6</td>
			</tr>
		</tfoot>
	</table>
</div>

<div class="sm:flex mx-auto space-x-8 w-full p-4">
	<h2 class="h2 text-center sm:text-left">Tournament Field</h2>
</div>

<div class="overflow-scroll w-full max-h-96 sm:max-h-screen">
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
						on:click={() => onGolferSelected(golfer)}
					>
						<td>{golfer?.first_name} {golfer?.last_name}</td>
						<td>{golfer?.owgr || 'Unranked'}</td>
						<td>${golfer?.price || 0}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
