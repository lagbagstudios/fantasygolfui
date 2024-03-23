<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<div class="container mx-auto p-8 space-y-8">
		<h1 class="h1">Forgot your password?</h1>
		<p>No problem, enter your email below and we'll send you a link to reset it.</p>
		<input
			class="input"
			type="email"
			placeholder="Email Address"
			title="Email Address"
			id="email"
			name="email"
		/>
		<button class="btn variant-filled-secondary">Reset Password</button>
		{#if form?.success}
			<p>{form?.message}</p>
		{/if}
	</div>
</form>
