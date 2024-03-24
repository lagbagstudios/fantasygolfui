import { json } from '@sveltejs/kit';

export async function POST(event) {
	const data: MastersGolfers = await event.request.json();

	const golfers = data.players.map((golfer) => {
		return {
			golfer_id: golfer.id as string,
			first_name: golfer.first_name as string,
			last_name: golfer.last_name as string,
			price: 0
		};
	});

	return json(golfers);
}

interface MastersGolfers {
	players: [any];
}
