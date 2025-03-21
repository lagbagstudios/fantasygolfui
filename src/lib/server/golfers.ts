import db from './db';
import { League } from './league';

export const GolferTable = db.collection<Golfer>('golfers');

const roundSum = (roundScores: [number]) => {
	return roundScores.reduce((partialSum: any, a: any) => partialSum + a, 0);
};

export const updateGolferScores = async () => {
	console.log('Updating golfer scores...');
	const mastersResponse = await fetch(
		'https://www.masters.com/en_US/scores/feeds/2025/scores.json'
	);
	const mastersLeaderboardData = await mastersResponse.json();
	const golfers = mastersLeaderboardData.data.player.map((golfer: any) => {
		const r1_score = roundSum(golfer.round1.scores);
		const r2_score = roundSum(golfer.round2.scores);
		const r3_score = golfer.status === 'C' ? 75 : roundSum(golfer.round4.scores);
		const r4_score = golfer.status === 'C' ? 75 : roundSum(golfer.round3.scores);

		return {
			golfer_id: golfer.id as string,
			first_name: golfer.first_name as string,
			last_name: golfer.last_name as string,
			r1_score: r1_score,
			r2_score: r2_score,
			r4_score: r3_score,
			r3_score: r4_score,
			score: r1_score + r2_score + r3_score + r4_score
		};
	});

	await golfers.forEach((golfer: any) => {
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
					r1_score: golfer.r1_score || 0,
					r2_score: golfer.r2_score || 0,
					r3_score: golfer.r3_score || 0,
					r4_score: golfer.r4_score || 0,
					score: golfer.score || 0
				}
			}
		);
	});
};
