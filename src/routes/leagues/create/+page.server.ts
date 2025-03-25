import { League, createLeague, DraftType } from '$lib/server/league';
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
		const draftTypeInput = formData.get('draft_type')?.toString();
		const budget = parseInt(formData.get('budget') as string);

		const draftType = draftTypeInput
			? Object.values(DraftType).find((type) => type.toLowerCase() === draftTypeInput.toLowerCase())
			: undefined;

		if (typeof leagueName !== 'string' || leagueName === '') {
			return fail(400, {
				message: 'Invalid league name',
				name_error: true,
				leagueName: leagueName
			});
		}

		if (isPrivate && (typeof leaguePassword !== 'string' || leaguePassword === '')) {
			return fail(400, {
				message: 'Invalid league password',
				password_error: true,
				leagueName: leagueName
			});
		}

		if (typeof draftType !== 'string' || !['snake', 'auction'].includes(draftType)) {
			return fail(400, {
				message: 'Invalid draft type',
				draft_type_error: true,
				leagueName: leagueName
			});
		}

		const existingLeague = await League.findOne({ league_name: leagueName });

		if (existingLeague?.owner_id === event.locals.user!!.id) {
			return fail(400, {
				message: 'League name taken',
				name_error: true,
				leagueName: leagueName
			});
		}

		await createLeague(
			event.locals.user!!.id,
			event.locals.user!!.givenName,
			leagueName,
			isPrivate,
			leaguePassword?.toString(),
			draftType,
			budget || 1000
		);

		return redirect(302, '/leagues');
	}
};
