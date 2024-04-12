import { GolferTable, updateGolferScores } from '$lib/server/golfers.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	await updateGolferScores();
	const golferTableData = await GolferTable.find().toArray();
	return json(golferTableData);
}
