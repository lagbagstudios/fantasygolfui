<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/state';
	import ShareIcon from '$lib/components/ShareIcon.svelte';
	import type { PageServerData } from './$types';

	const toastStore = getToastStore();

	export let data: PageServerData;
	const ownedLeagues: [League?] = data.ownedLeagues;
	const joinedLeagues: [League?] = data.joinedLeagues;

	const onShareIconClicked = (joinCode: string | undefined) => {
		navigator.clipboard.writeText(`${page.url.origin}/leagues/join/${joinCode}`);
		const t: ToastSettings = {
			message: 'League Join Code Copied to Clipboard!',
			background: 'variant-filled-success',
			timeout: 2000
		};
		toastStore.trigger(t);
	};
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

					<p class="inline-flex pl-12">
						Join Code: {league?.join_code}

						<button on:click={() => onShareIconClicked(league?.join_code)} class="relative group">
							<ShareIcon />
							<span
								class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-4 whitespace-nowrap"
							>
								Copy Share Link
							</span>
						</button>
					</p>
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
