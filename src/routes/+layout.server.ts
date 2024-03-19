import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user) {
		return {
			googleEmail: event.locals.user.googleEmail,
			googleId: event.locals.user.googleId,
			givenName: event.locals.user.givenName
		};
	} else {
		return {};
	}
};
