import { API_KEY } from '$env/static/private';
import { GolferTable } from '$lib/server/golfers.js';
import { League } from '$lib/server/league.js';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const apiKey = event.request.headers.get('x-api-key');
	if (apiKey !== API_KEY) {
		return new Response(null, { status: 401 });
	}

	const data: [Golfer] = await event.request.json();

	await data.forEach((golfer) => {
		League.updateMany(
			{},
			{
				$set: {
					'teams.$[].golfers.$[g].score': golfer.score,
					'teams.$[].golfers.$[g].r1_score': golfer.r1_score,
					'teams.$[].golfers.$[g].r2_score': golfer.r2_score,
					'teams.$[].golfers.$[g].r3_score': golfer.r3_score,
					'teams.$[].golfers.$[g].r4_score': golfer.r4_score
				}
			},
			{
				arrayFilters: [{ 'g.golfer_id': golfer.golfer_id }]
			}
		);

		GolferTable.updateOne(
			{
				golfer_id: golfer.golfer_id
			},
			{
				$set: {
					r1_score: golfer.r1_score,
					r2_score: golfer.r2_score,
					r3_score: golfer.r3_score,
					r4_score: golfer.r4_score,
					score: golfer.score
				}
			}
		);
	});

	const golfers = await GolferTable.find().toArray();

	return json(golfers);
}
