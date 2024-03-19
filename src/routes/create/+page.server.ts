import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	return {
		googleEmail: event.locals.user.googleEmail,
		googleId: event.locals.user.googleId,
		givenName: event.locals.user.givenName
	};
};
