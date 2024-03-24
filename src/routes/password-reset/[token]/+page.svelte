<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<div class="container mx-auto p-8 space-y-8">
		<input
			class="input"
			type="password"
			title="New Password"
			placeholder="New Password"
			name="password"
			id="password"
		/>
		{#if form?.password_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}
		<input
			class="input"
			type="password"
			title="Enter Password Again"
			placeholder="Re-type New Password"
			name="password-match"
			id="password-match"
		/>
		{#if form?.match_error}
			<strong class="text-center text-error-500">{form?.message}</strong>
		{/if}
		<div>
			<button type="submit" class="btn variant-filled-secondary">Update Password</button>
		</div>
		<div>
			{#if form?.token_error}
				<p>
					{form?.message}
				</p>
				<a href="/password-reset" class="text-primary-500">You may request another link here.</a>
			{/if}
		</div>
	</div>
</form>

{#if form?.success}
	<a href="/login">Password reset successfully, click here to login.</a>
{/if}
