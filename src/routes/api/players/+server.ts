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
			{ golfer_id: golfer.golfer_id },
			{
				$set: {
					golfer_id: golfer.golfer_id,
					first_name: golfer.first_name,
					last_name: golfer.last_name,
					price: golfer.price,
					r1_score: golfer.r1_score,
					r2_score: golfer.r2_score,
					r3_score: golfer.r3_score,
					r4_score: golfer.r4_score,
					score: golfer.score,
					owgr: golfer.owgr
				}
			},
			{ upsert: true }
		);
	});

	return json(golfers);
}

export async function GET(event) {
	const apiKey = event.request.headers.get('x-api-key');
	if (apiKey !== API_KEY) {
		return new Response(null, { status: 401 });
	}

	const golfers = await GolferTable.find().toArray();

	golfers.sort((a, b) => {
		if ((a?.owgr || 99999) < (b?.owgr || 99999)) {
			return -1;
		} else if ((a?.owgr || 0) > (b?.owgr || 0)) {
			return 1;
		} else {
			return 0;
		}
	});

	return json(golfers);
}
