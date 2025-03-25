<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	let code = form?.code || $page.url.searchParams.get('code');
</script>

<svelte:head>
	<title>Join a League</title>
</svelte:head>

<div class="container p-8">
	<h1 class="h1 pb-8">Join a League</h1>
	{#if form?.needs_password}
		<form method="post" action="?/password" use:enhance>
			<div class="pb-8">
				<label class="label">
					<span>League Code</span>
					<input class="input" name="code" id="code" bind:value={code} />
				</label>
			</div>
			<label for="code">League Password</label>
			<div class="flex rounded-lg shadow-sm">
				<input
					type="password"
					id="password"
					name="password"
					placeholder="League Password"
					class="py-3 px-4 block w-full text-sm disabled:pointer-events-none input"
				/>
				<button
					type="submit"
					class="py-3 px-12 inline-flex justify-center items-center gap-x-2 text-sm font-semibold btn variant-filled-secondary"
				>
					Join
				</button>
			</div>
			{#if form?.password_error}
				<strong class="text-center text-error-500">{form?.message}</strong>
			{/if}
		</form>
	{/if}

	{#if !form?.needs_password}
		<form method="post" action="?/join" use:enhance>
			<label for="code">Join Code</label>
			<div class="flex rounded-lg shadow-sm">
				<input
					type="text"
					id="code"
					name="code"
					placeholder="Join Code"
					class="py-3 mr-2 px-4 block w-full text-sm disabled:pointer-events-none input"
					bind:value={code}
				/>
				<button
					type="submit"
					class="py-3 px-12 inline-flex justify-center items-center gap-x-2 text-sm font-semibold btn variant-filled-secondary"
				>
					Join
				</button>
			</div>
			{#if form?.code_error || form?.league_error}
				<strong class="text-center text-error-500">{form?.message}</strong>
			{/if}
		</form>
	{/if}
</div>
