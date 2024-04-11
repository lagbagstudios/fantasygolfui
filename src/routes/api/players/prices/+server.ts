import { API_KEY } from '$env/static/private';
import { GolferTable } from '$lib/server/golfers.js';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const apiKey = event.request.headers.get('x-api-key');
	if (apiKey !== API_KEY) {
		return new Response(null, { status: 401 });
	}
	const golfers: [Golfer] = await event.request.json();

	await golfers.forEach((golfer) => {
		GolferTable.updateOne(
			{ first_name: golfer.first_name, last_name: golfer.last_name },
			{
				$set: {
					golfer_id: golfer.golfer_id,
					first_name: golfer.first_name,
					last_name: golfer.last_name,
					price: golfer.price,
					owgr: golfer.owgr
				}
			},
			{ upsert: true }
		);
	});

	const returnValue = await GolferTable.find().toArray();

	return json(returnValue);
}
