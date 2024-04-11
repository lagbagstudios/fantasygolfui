import { json } from '@sveltejs/kit';

export async function POST(event) {
	const data: MastersGolfers = await event.request.json();

	const golfers = data.player.map((golfer) => {
		return {
			golfer_id: golfer.id as string,
			first_name: golfer.first_name as string,
			last_name: golfer.last_name as string,
			r1_score: parseInt(golfer.round1.total) as number,
			r2_score: parseInt(golfer.round2.total) as number,
			r3_score: parseInt(golfer.round3.total) as number,
			r4_score: parseInt(golfer.round4.total) as number,
			score: parseInt(golfer.total) as number
		};
	});

	return json(golfers);
}

interface MastersGolfers {
	player: [any];
}
