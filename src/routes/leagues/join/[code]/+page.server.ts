import { League, getDefaultTeamName } from '$lib/server/league';
import { redirect, error } from '@sveltejs/kit';
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

	const joinCode = event.params.code;
	const userId = event.locals.user.id;
	const givenName = event.locals.user.givenName;

	if (typeof joinCode !== 'string' || joinCode === '') {
		return error(400, {
			message: 'Invalid Code'
		});
	}

	const existingLeague = await League.findOne({ join_code: joinCode });

	if (!existingLeague) {
		return error(404, {
			message: 'League not found'
		});
	}

	if (existingLeague.teams?.find((team) => team.user_id === userId)) {
		return error(400, {
			message: 'Already joined this league'
		});
	}

	if (existingLeague.is_private) {
		return redirect(302, `/leagues/join`);
	} else {
		await joinLeague(joinCode, userId, givenName);
		return redirect(302, '/leagues');
	}
};
