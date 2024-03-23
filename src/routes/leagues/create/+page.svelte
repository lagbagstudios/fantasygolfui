<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
	let isPrivate = false;
</script>

<form method="post">
	<div class="container p-8 space-y-8 mx-auto">
		<h1 class="h1 text-center sm:text-left">Create League</h1>
		<label class="label">
			<span>League Name</span>
			<input
				class="input"
				type="text"
				title="League Name"
				placeholder="League Name"
				id="name"
				name="name"
			/>
		</label>
		{#if form?.name_error}
			<span class="text-error-500">{form?.message}</span>
		{/if}
		<label class="flex items-center space-x-2">
			<input
				class="checkbox"
				type="checkbox"
				title="Is Private League"
				id="private"
				name="private"
				bind:checked={isPrivate}
			/>
			<p>Private (require a password to join)</p>
		</label>
		{#if isPrivate}
			<label class="label">
				<span>League Password</span>
				<input
					class="input"
					type="password"
					title="League Password"
					placeholder="League Password"
					id="password"
					name="password"
				/>
			</label>
			{#if form?.name_error}
				<span class="text-error-500">{form?.message}</span>
			{/if}
		{/if}
		<div class="grid grid-cols-2 gap-4">
			<button type="reset" class="btn variant-ringed">Clear</button>
			<button type="submit" class="btn variant-filled">Submit</button>
		</div>
	</div>
</form>
