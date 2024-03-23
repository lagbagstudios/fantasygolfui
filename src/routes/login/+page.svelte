<script lang="ts">
	import { enhance } from '$app/forms';
	import ContinueWithGoogle from '$lib/components/ContinueWithGoogle.svelte';
	import type { ActionData } from '../$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<div class="container mx-auto p-8 space-y-8">
		<h1 class="h1 text-center sm:text-left">Sign In</h1>
		<label class="label">
			<span>Email Address</span>
			<input
				class="input"
				title="Email Address"
				type="text"
				placeholder="Email Address"
				id="email"
				name="email"
			/>
		</label>
		<label class="label">
			<span>Password</span>
			<input
				class="input"
				title="Password"
				type="password"
				placeholder="Password"
				id="password"
				name="password"
			/>
		</label>
		<a href="/password-reset">Forgot your password?</a>
		{#if form?.incorrect}
			<p class="text-center">{form?.message}</p>
		{/if}
		<div class="flex items-center justify-center">
			<button class="btn btn-lg variant-ringed w-full sm:w-2/3" type="submit">Continue</button>
		</div>
		<h3 class="h3 text-center">- or -</h3>
		<div class="flex items-center justify-center">
			<ContinueWithGoogle />
		</div>
	</div>
</form>
