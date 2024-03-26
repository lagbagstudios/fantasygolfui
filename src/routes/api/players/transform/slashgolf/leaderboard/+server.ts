import { json } from '@sveltejs/kit';

export async function POST(event) {
	const data: SlashgolfLeaderboard = await event.request.json();

	const golfers = data.leaderboardRows.map((golfer: LeaderboardGolfer): Golfer => {
		const r1 = golfer.rounds.find((round) => round?.roundId.$numberInt == '1');
		const r2 = golfer.rounds.find((round) => round?.roundId.$numberInt == '2');
		const r3 = golfer.rounds.find((round) => round?.roundId.$numberInt == '3');
		const r4 = golfer.rounds.find((round) => round?.roundId.$numberInt == '4');

		return {
			slashgolf_id: golfer.playerId as string,
			first_name: golfer.firstName as string,
			last_name: golfer.lastName as string,
			score: parseInt(golfer.totalStrokesFromCompletedRounds) as number,
			r1_score: parseInt(r1?.strokes.$numberInt || '0'),
			r2_score: parseInt(r2?.strokes.$numberInt || '0'),
			r3_score: parseInt(r3?.strokes.$numberInt || '0'),
			r4_score: parseInt(r4?.strokes.$numberInt || '0')
		};
	});

	return json(golfers);
}

interface SlashgolfLeaderboard {
	leaderboardRows: [LeaderboardGolfer];
}

interface LeaderboardGolfer {
	firstName: string;
	lastName: string;
	playerId: string;
	totalStrokesFromCompletedRounds: string;
	rounds: [Round?];
}

interface Round {
	scoreToPar: string;
	roundId: NumberInt;
	strokes: NumberInt;
}

interface NumberInt {
	$numberInt: string;
}
