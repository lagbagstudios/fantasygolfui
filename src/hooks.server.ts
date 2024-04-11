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

export const handle = sequence(first, second);
