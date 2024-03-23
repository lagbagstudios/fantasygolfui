<script lang="ts">
	import { enhance } from '$app/forms';
	import ContinueWithGoogle from '$lib/components/ContinueWithGoogle.svelte';
	import type { ActionData } from '../$types';
	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<div class="container mx-auto p-8 space-y-8">
		<h1 class="h1 text-center">Sign Up</h1>
		<label class="label" for="givenName"
			><span>First Name</span><input
				class="input"
				title="First Name"
				type="text"
				placeholder="First Name"
				id="givenName"
				name="givenName"
			/></label
		>
		{#if form?.name_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}
		<label class="label" for="email"
			><span>Email Address</span><input
				class="input"
				title="Email Address"
				type="email"
				placeholder="Email Address"
				id="email"
				name="email"
			/></label
		>
		{#if form?.email_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}
		<label class="label" for="password"
			><span>Password</span><input
				class="input"
				title="Password"
				type="password"
				placeholder="Password"
				id="password"
				name="password"
			/></label
		>
		{#if form?.password_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}
		<div class="flex items-center justify-center">
			<button class="btn btn-lg variant-ringed" type="submit">Continue</button>
		</div>
		<h3 class="h3 text-center">- or -</h3>
		<div class="flex items-center justify-center">
			<ContinueWithGoogle />
		</div>
	</div>
</form>
