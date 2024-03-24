import { League, createLeague } from '$lib/server/league';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const leagueName = formData.get('name');
		const privateFormData = formData.get('private');
		const isPrivate = privateFormData === 'on';
		const leaguePassword = formData.get('password');

		if (typeof leagueName !== 'string' || leagueName === '') {
			return fail(400, {
				message: 'Invalid league name',
				name_error: true
			});
		}

		if (isPrivate && (typeof leaguePassword !== 'string' || leaguePassword === '')) {
			return fail(400, {
				message: 'Invalid league password',
				password_error: true
			});
		}

		const existingLeague = await League.findOne({ league_name: leagueName });

		if (existingLeague) {
			return fail(400, {
				message: 'League name taken',
				name_error: true
			});
		}

		await createLeague(
			event.locals.user!!.id,
			event.locals.user!!.givenName,
			leagueName,
			isPrivate,
			leaguePassword?.toString()
		);

		return redirect(302, '/leagues');
	}
};
