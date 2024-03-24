import { League, getDefaultTeamName } from '$lib/server/league';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const joinLeague = async (joinCode: string, userId: string, givenName: string) => {
	await League.updateOne(
		{ join_code: joinCode },
		{
			$push: {
				teams: { user_id: userId, team_name: getDefaultTeamName(givenName) }
			}
		}
	);
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
};

export const actions: Actions = {
	join: async (event) => {
		const formData = await event.request.formData();
		const joinCode = formData.get('code');
		const userId = event.locals.user!!.id;
		const givenName = event.locals.user!!.givenName;

		if (typeof joinCode !== 'string' || joinCode === '') {
			return fail(400, {
				message: 'Invalid Code',
				code_error: true
			});
		}

		const existingLeague = await League.findOne({ join_code: joinCode });

		if (!existingLeague) {
			return fail(400, {
				message: 'Invalid Code',
				code_error: true
			});
		}

		if (existingLeague.teams?.find((team) => team.user_id === userId)) {
			return fail(400, {
				message: 'Already joined this league',
				league_error: true
			});
		}

		if (existingLeague.is_private) {
			return {
				code: joinCode,
				needs_password: true
			};
		} else {
			await joinLeague(joinCode, userId, givenName);
			return redirect(302, '/leagues');
		}
	},
	password: async (event) => {
		const formData = await event.request.formData();
		const joinCode = formData.get('code');
		const password = formData.get('password');
		const userId = event.locals.user!!.id;
		const givenName = event.locals.user!!.givenName;

		if (typeof joinCode !== 'string' || joinCode === '') {
			return fail(400, {
				message: 'Invalid Code',
				code: joinCode,
				code_error: true,
				needs_password: true
			});
		}

		if (typeof password !== 'string' || password === '') {
			return fail(400, {
				message: 'Invalid password',
				code: joinCode,
				password_error: true,
				needs_password: true
			});
		}

		const existingLeague = await League.findOne({ join_code: joinCode });

		if (existingLeague?.league_password !== password) {
			return fail(401, {
				message: 'Incorrect password',
				code: joinCode,
				password_error: true,
				needs_password: true
			});
		}

		await joinLeague(joinCode, userId, givenName);
		return redirect(302, '/leagues');
	}
};
