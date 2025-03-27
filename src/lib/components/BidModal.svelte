<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton';

	export let golferName = 'Golfer Name';
	export let bidAmount = 0;

	export let open = false;
	export let modalClose = () => (open = false);
	export let confirm = () => (open = false);
</script>

<Modal
	{open}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	<header class="flex justify-between">
		<h2 class="h2">Bid on {golferName}</h2>
	</header>
	<input type="number" class="input" bind:value={bidAmount} placeholder="Bid amount" />
	<footer class="flex justify-end gap-4">
		<button type="button" class="btn preset-tonal" on:click={modalClose}>Cancel</button>
		<button type="button" class="btn preset-filled" on:click={confirm}>Confirm</button>
	</footer>
</Modal>
