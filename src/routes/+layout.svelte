<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, autoModeWatcher, Toast, Modal } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import {
		storeHighlightJs,
		initializeStores,
		Drawer,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Used for Modals & Toasts
	initializeStores();
	const drawerStore = getDrawerStore();

	export let data;

	const drawerOpen = () => {
		drawerStore.open({});
	};
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Drawer>
	<h2 class="h2 p-4">LAGbag Fantasy Golf</h2>
	<hr />
	<Navigation authenticated={data.authenticated} />
</Drawer>

<Toast position="b" />

<Modal />

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<a href="/" class="text-xl flex sm:hidden" title="Go to Homepage">
						<strong class="uppercase">LFG</strong>
					</a>
					<a href="/" class="text-xl hidden sm:flex" title="Go to Homepage">
						<strong class="uppercase">LAGbag Fantasy Golf</strong>
					</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data.givenName}
					<p class="invisible md:visible">Welcome, {data.givenName}!</p>
					<form method="post" action="/" use:enhance>
						<button type="submit" class="btn variant-ghost">Logout</button>
					</form>
					{#if !data.emailVerified}
						<a href="/verify-email" class="btn variant-ringed">Verify Email</a>
					{/if}
				{:else}
					<a class="btn bg-initial" href="/login">Sign In</a>
					<a class="btn variant-ringed" href="/signup">Sign Up</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft"
		><Navigation authenticated={data.authenticated} /></svelte:fragment
	>
	<slot />
</AppShell>
