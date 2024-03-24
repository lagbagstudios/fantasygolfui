import { API_KEY } from '$env/static/private';
import { GolferTable } from '$lib/server/golfers.js';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const apiKey = event.request.headers.get('x-api-key');
	if (apiKey !== API_KEY) {
		return new Response(null, { status: 401 });
	}

	const data: [OWGR] = await event.request.json();

	await data.forEach((golfer) => {
		const [first_name, last_name] = golfer.player_name.split(' ');
		GolferTable.updateOne(
			{
				first_name: first_name,
				last_name: last_name
			},
			{
				$set: {
					owgr: golfer.position
				}
			},
			{ upsert: false }
		);
	});

	const golfers = await GolferTable.find().toArray();

	return json(golfers);
}

interface OWGR {
	position: number;
	player_name: string;
}
