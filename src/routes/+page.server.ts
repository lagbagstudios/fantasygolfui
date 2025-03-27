import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { League } from '$lib/server/league';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	const userId = event.locals.user?.id;

	const joinedLeagues = await League.find({
		'teams.user_id': userId
	}).toArray();

	const teams = joinedLeagues.map((league) => {
		const team = league.teams?.find((team) => team.user_id === userId);
		return {
			leagueName: league.league_name,
			leagueId: league._id,
			teamName: team?.team_name
		};
	});

	return { teams: JSON.parse(JSON.stringify(teams)) };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
};
