<script lang="ts">
	export let golfers: [Golfer?] = [];

	let totalScore: number = 0;
	let r1Score: number = 0;
	let r2Score: number = 0;
	let r3Score: number = 0;
	let r4Score: number = 0;

	golfers.forEach((golfer) => {
		totalScore += golfer?.score || 0;
		r1Score += golfer?.r1_score || 0;
		r2Score += golfer?.r2_score || 0;
		r3Score += golfer?.r3_score || 0;
		r4Score += golfer?.r4_score || 0;
	});
</script>

<div class="overflow-auto w-full">
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Golfer</th>
					<th>Tournament Score</th>
					<th>R1 Score</th>
					<th>R2 Score</th>
					<th>R3 Score</th>
					<th>R4 Score</th>
				</tr>
			</thead>
			<tbody>
				{#each golfers as golfer}
					<tr>
						<td>{golfer?.first_name} {golfer?.last_name}</td>
						<td>{golfer?.score || 0}</td>
						<td>{golfer?.r1_score || 0}</td>
						<td>{golfer?.r2_score || 0}</td>
						<td>{golfer?.r3_score || 0}</td>
						<td>{golfer?.r4_score || 0}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th>Totals</th>
					<td>{totalScore}</td>
					<td>{r1Score}</td>
					<td>{r2Score}</td>
					<td>{r3Score}</td>
					<td>{r4Score}</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>

<ul></ul>
