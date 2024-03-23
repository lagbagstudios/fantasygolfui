<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	export let authenticated: boolean = false;
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Home</a></li>
		{#if authenticated}
			<li><a href="/leagues/create" on:click={drawerClose}>Create a League</a></li>
			<li><a href="/leagues/join" on:click={drawerClose}>Join a League</a></li>
			<li><a href="/leagues" on:click={drawerClose}>My Leagues</a></li>
		{:else}
			<li><a href="/login" on:click={drawerClose}>Sign In</a></li>
			<li><a href="/signup" on:click={drawerClose}>Sign Up</a></li>
		{/if}
	</ul>
</nav>
