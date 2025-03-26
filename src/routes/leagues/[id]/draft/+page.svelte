<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData, ActionData } from './$types';
	import {
		getToastStore,
		getModalStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let data: PageData;
	export let form: ActionData;

	const golfers: Golfer[] = data?.golfers || [];
	const league: League = data?.league;
	const myTeam: Team = data?.myTeam;
	const userId = data?.userId;

	let selectedGolferIDs: (string | undefined)[] = myTeam?.golfers?.map((g) => g.golfer_id) || [];
	let bidGolferIDs: (string | undefined)[] =
		form?.golferData?.map((g) => g.golfer_id) || data?.myTeam?.bids?.map((g) => g.golfer_id) || [];

	const onGolferSelected = (golfer: Golfer | undefined) => {
		if (league?.draft_type === 'auction') {
			if (bidGolferIDs.find((g) => g === golfer?.golfer_id) && golfer?.current_bid === 0) {
				// Remove golfer from bidGolfers
				bidGolferIDs = bidGolferIDs.filter((id) => id !== golfer?.golfer_id);
			} else {
				if (golfer?.current_bid && golfer?.current_bid > remainingBudget) {
					const t: ToastSettings = {
						message: `Not enough budget remaining for ${golfer?.first_name} ${golfer?.last_name}.`,
						timeout: 3000,
						background: 'variant-filled-warning'
					};
					toastStore.trigger(t);
				} else {
					if (!bidGolferIDs.find((g) => g === golfer?.golfer_id)) {
						bidGolferIDs.push(golfer?.golfer_id);
					}
				}
			}
			bidGolferIDs = bidGolferIDs;
		} else if (league?.draft_type === 'manual') {
			if (selectedGolferIDs.find((g) => g === golfer?.golfer_id)) {
				// Remove golfer from selectedGolfers
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
		}
	};

	const confirmEndDraftRoundModal = () =>
		new Promise((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'End Auction Round?',
				body: `Are you sure you want to end the auction round?`,
				response: (r: boolean) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

	const isWinningBid = (golfer: Golfer) => {
		const matchingGolfer = data?.league?.draft_board?.find(
			(bid: Golfer) => bid.golfer_id === golfer.golfer_id
		);
		return matchingGolfer?.winning_bidder_id === myTeam?.user_id;
	};

	bidGolferIDs = bidGolferIDs;

	$: selectedGolfers = golfers.filter((golfer) => selectedGolferIDs.includes(golfer?.golfer_id));

	$: bidGolfers = data?.auctionBoard
		?.filter((golfer: Golfer) => bidGolferIDs.includes(golfer.golfer_id))
		.map((golfer: Golfer) => {
			const myBid = data?.myTeam?.bids?.find((bid: Golfer) => bid.golfer_id === golfer.golfer_id);
			if (myBid) myBid.winning_bid = golfer.winning_bid;
			return myBid || golfer;
		});

	$: remainingBudget =
		league?.draft_type === 'manual'
			? selectedGolfers &&
				(league?.budget || 0) - selectedGolfers.reduce((n, golfer) => n + (golfer?.price || 0), 0)
			: bidGolfers &&
				(league?.budget || 0) -
					bidGolfers.reduce((n: number, golfer: Golfer) => n + (golfer?.current_bid || 0), 0);

	$: leagueId = page.params.id;

	$: autoRefresh = league?.draft_type === 'auction';
</script>

{#if autoRefresh}
	<meta http-equiv="refresh" content="30" />
{/if}

<svelte:head>
	<title>{league?.league_name || 'Unknown League'} - Draft</title>
</svelte:head>

<div class="container p-4">
	<a href="/leagues/{leagueId}" class="btn variant-ghost w-full sm:w-auto sm:float-left"
		>Return to League Home</a
	>

	{#if form?.draft_error}
		<span class="text-error-500 p-4">{form?.message}</span>
	{/if}
	{#if league?.draft_type === 'manual'}
		<form
			method="post"
			use:enhance={({ formData }) => {
				formData.append('golfers', JSON.stringify(selectedGolfers));
				formData.append('draft_type', 'manual');

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

		<div class="table-container space-y-4 pb-8 md:max-h-screen">
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
							<td>${golfer?.price || 0}</td>
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

		<div class="overflow-scroll w-full md:max-h-screen">
			<div class="table-container">
				<table class="table table-interactive">
					<thead>
						<tr>
							<th>Golfer</th>
							<th>World Golf Ranking</th>
							<th>Current Highest Bid</th>
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
	{:else if league?.draft_type === 'auction'}
		<form
			method="post"
			action="?/submit"
			use:enhance={({ formData }) => {
				formData.append('golfers', JSON.stringify(bidGolfers));
				formData.append('draft_type', 'auction');

				return async ({ result, update }) => {
					await update();
					if (result.type === 'redirect') {
						goto(result.location);
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<div class="flex mx-auto w-full p-4">
				<h2 class="h2 w-full">Your Bids</h2>
				<button
					type="submit"
					class="btn variant-ghost-success ml-16 pl-12 pr-12"
					disabled={bidGolferIDs.length < 1}>Submit Bids</button
				>
			</div>

			<div class="table-container space-y-4 pb-8 md:max-h-screen">
				<table class="table table-interactive">
					<thead>
						<tr>
							<th>Golfer</th>
							<th>Your Bid</th>
							<th>Current Highest Bid</th>
						</tr>
					</thead>
					<tbody>
						{#each bidGolfers as golfer}
							<tr class:table-row-checked={isWinningBid(golfer)}>
								<td on:click={() => onGolferSelected(golfer)}
									>{golfer.first_name} {golfer.last_name}</td
								>
								<td><input type="number" class="input" bind:value={golfer.current_bid} /></td>
								<td on:click={() => onGolferSelected(golfer)}>${golfer.winning_bid || 0}</td>
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
		</form>

		{#if league?.owner_id === userId}
			<form
				method="post"
				action="?/end_auction_round"
				use:enhance={async ({ cancel }) => {
					await confirmEndDraftRoundModal().then((res) => {
						if (!res) {
							cancel();
						}
					});
					return async ({ result }) => {
						if (result.type === 'redirect') {
							goto(result.location);
						} else {
							await applyAction(result);
						}
					};
				}}
			>
				<button class="btn variant-ghost-warning inline-flex w-full p-4 mb-4"
					>End Auction Round</button
				>
			</form>
		{/if}

		<div class="flex mx-auto w-full p-4">
			<h2 class="h2 w-full">Your Team</h2>
		</div>

		<div class="table-container space-y-4 pb-8 md:max-h-screen">
			<table class="table table-interactive">
				<thead>
					<tr>
						<th>Golfer</th>
						<th>Winning Bid</th>
					</tr>
				</thead>
				<tbody>
					{#each data?.myTeam?.golfers || [] as golfer}
						<tr on:click={() => onGolferSelected(golfer)}>
							<td>{golfer?.first_name} {golfer?.last_name}</td>
							<td>${golfer?.winning_bid || 0}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
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

		<div class="overflow-scroll w-full md:max-h-screen">
			<div class="table-container">
				<table class="table table-interactive">
					<thead>
						<tr>
							<th>Golfer</th>
							<th>World Golf Ranking</th>
							<th>Current Highest Bid</th>
						</tr>
					</thead>
					<tbody>
						{#each data?.auctionBoard as golfer}
							<tr
								class:table-row-checked={bidGolferIDs.includes(golfer?.golfer_id)}
								on:click={() => onGolferSelected(golfer)}
							>
								<td>{golfer?.first_name} {golfer?.last_name}</td>
								<td>{golfer?.owgr || 'Unranked'}</td>
								<td>${golfer?.winning_bid || 0}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
