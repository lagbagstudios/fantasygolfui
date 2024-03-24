<script lang="ts">
	import EditIcon from '$lib/components/EditIcon.svelte';
	import CheckIcon from '$lib/components/CheckIcon.svelte';
	import XIcon from '$lib/components/XIcon.svelte';
	import type { ActionData, PageServerData } from './$types';
	import Golfers from '$lib/components/Golfers.svelte';
	import { page } from '$app/stores';

	export let form: ActionData;
	export let data: PageServerData;
	const userId = data.userId;
	const league: League = data?.league || {};
	const teams: [Team?] = league?.teams || [];
	const myTeam: Team = teams?.find((team) => team?.user_id === userId)!!;
	let myTeamName: string | undefined = myTeam?.team_name;

	let nameInput: HTMLInputElement;
	let isEditing = false;
	const isEditingSwitch = () => {
		isEditing = !isEditing;
		nameInput.focus();
	};

	const resetName = () => {
		myTeamName = myTeam?.team_name;
		isEditing = false;
	};
</script>

{#if data?.not_found}
	<div class="container p-8 space-y-8">
		<h2 class="h2">Could not find league</h2>
		<a href="/leagues" class="btn variant-filled">Back to My Leagues</a>
	</div>
{:else}
	<div class="container p-8">
		<h1 class="h1 pb-8">{league?.league_name}</h1>
		<form method="post" action="?/team">
			<div class="flex">
				{#if !isEditing}
					<button
						type="button"
						class="btn-icon flex-shrink-0"
						title="Edit Team Name"
						on:click={isEditingSwitch}><EditIcon /></button
					>
				{/if}

				<input
					class="appearance-none bg-transparent border-none text-xl mr-3 leading-tight font-bold w-full focus:outline-none focus:border-none"
					type="text"
					name="team_name"
					id="team_name"
					bind:value={myTeamName}
					bind:this={nameInput}
					on:focus={() => (isEditing = true)}
				/>
				{#if isEditing}
					<button type="button" class="btn-icon flex-shrink-0" title="Cancel" on:click={resetName}
						><XIcon /></button
					>
					<button type="submit" class="btn-icon flex-shrink-0" title="Save Changes"
						><CheckIcon /></button
					>
				{/if}
			</div>
		</form>
		{#if form?.name_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}

		<!--User's Team-->
		{#if myTeam.golfers && myTeam.golfers.length > 0}
			<Golfers golfers={myTeam.golfers} />
		{:else}
			<a href="/leagues/{$page.params.id}/draft" class="btn variant-ghost-primary w-full"
				>Draft Your Team</a
			>
		{/if}

		<!-- Everyone Else's Teams-->
		{#each teams as team}
			{#if !(team?.user_id === userId)}
				<h3 class="h3 pt-8 pb-2">{team?.team_name}</h3>
				<Golfers golfers={team?.golfers} />
			{/if}
		{/each}
	</div>
{/if}
