import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { User, google, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('stored_code_verifier') ?? null;

	if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const user = await googleUserResponse.json();

		const existingUser = await User.findOne({ google_email: { $eq: user.email } });

		if (existingUser) {
			const session = await lucia.createSession(existingUser._id, {
				googleId: user.google_id,
				googleEmail: user.google_email,
				givenName: user.given_name
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			await User.updateOne(
				{ _id: userId },
				{
					$set: {
						_id: userId,
						google_email: user.email,
						google_id: user.sub,
						given_name: user.given_name
					}
				},
				{ upsert: true }
			);

			const session = await lucia.createSession(userId, {
				googleId: user.google_id,
				googleEmail: user.google_email,
				givenName: user.given_name
			});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			console.log('OAuth Error');
			return new Response(null, {
				status: 400
			});
		}
		console.log(`Unknown error ${e}`);
		return new Response(null, {
			status: 500
		});
	}
}
