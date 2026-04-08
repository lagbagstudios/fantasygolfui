import { API_KEY } from '$env/static/private';
import { GolferTable } from '$lib/server/golfers.js';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const apiKey = event.request.headers.get('x-api-key');
	if (apiKey !== API_KEY) {
		return new Response(null, { status: 401 });
	}

	const data: [Golfer] = await event.request.json();

	await data.forEach((golfer) => {
		GolferTable.updateOne(
			{
				slashgolf_id: golfer.slashgolf_id
			},
			{
				$set: {
					owgr: golfer.owgr
				}
			},
			{ upsert: false }
		);
	});

	const golfers = await GolferTable.find().toArray();

	return json(golfers);
}
