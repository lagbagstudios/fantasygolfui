import { json } from '@sveltejs/kit';

export async function POST(event) {
	const data: SlashgolfTournament = await event.request.json();

	const golfers = data.players.map((golfer: SlashgolfPlayer): Golfer => {
		return {
			slashgolf_id: golfer.playerId as string,
			first_name: golfer.firstName as string,
			last_name: golfer.lastName as string
		};
	});

	return json(golfers);
}

interface SlashgolfTournament {
	players: [SlashgolfPlayer];
}

interface SlashgolfPlayer {
	firstName: string;
	lastName: string;
	playerId: string;
}
