<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="container p-8 space-y-8 text-center">
	<p class="h3">{page.error?.message}</p>
	<a class="btn variant-filled t-8" href="/">Go Back to Home</a>
</div>
