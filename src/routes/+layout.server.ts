import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user) {
		return {
			email: event.locals.user.email,
			googleId: event.locals.user.googleId,
			givenName: event.locals.user.givenName,
			emailVerified: event.locals.user.emailVerified,
			authenticated: true
		};
	} else {
		return {
			authenticated: false
		};
	}
};
