<script>
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Verify Email</title>
</svelte:head>

<form method="post" action="?/verify" use:enhance>
	<div class="container mx-auto p-8 space-y-8">
		<h1 class="h1">Verify your Email Address</h1>
		<label class="label">
			<span>Verification Code</span>
			<input
				type="text"
				class="input"
				title="Verification Code"
				placeholder="Verification Code"
				id="code"
				name="code"
			/>
		</label>
		<button type="submit" class="btn variant-filled-secondary">Verify</button>
		<form method="post" action="?/resend" use:enhance>
			<button type="submit" class="btn variant-ghost">Resend Verification Code</button>
		</form>
	</div>
</form>
