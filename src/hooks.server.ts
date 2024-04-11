import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { start_mongo } from '$lib/server/db';
import { sequence } from '@sveltejs/kit/hooks';
import { League } from '$lib/server/league';
import { GolferTable } from '$lib/server/golfers';

start_mongo()
	.then(() => {
		console.log('Connected to database');
	})
	.catch((e) => console.error(e));

const first: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (event.url.pathname.startsWith('/password-reset')) {
		response.headers.set('Referrer-Policy', 'no-referrer');
	}

	return response;
};

const second: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const third: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/') {
		const mastersResponse = await fetch(
			'https://www.masters.com/en_US/scores/feeds/2024/scores.json'
		);
		const mastersLeaderboardData = await mastersResponse.json();
		const golfers = mastersLeaderboardData.data.player.map((golfer: any) => {
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
	}

	return resolve(event);
};

export const handle = sequence(first, second, third);
