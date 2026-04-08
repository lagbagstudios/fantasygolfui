import { json } from '@sveltejs/kit';

export async function POST(event) {
	const data: SlashgolfRankings = await event.request.json();

	const golfers = data.rankings.map((golfer: RankingGolfer): Golfer => {
		return {
			slashgolf_id: golfer.playerId,
			first_name: golfer.firstName,
			last_name: golfer.lastName,
			owgr: Number(golfer.rank.$numberInt)
		};
	});

	return json(golfers);
}

interface SlashgolfRankings {
	rankings: [RankingGolfer];
}

interface RankingGolfer {
	playerId: string;
	firstName: string;
	lastName: string;
	rank: NumberInt;
}

interface NumberInt {
	$numberInt: string;
}
