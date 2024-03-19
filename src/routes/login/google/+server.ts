import { redirect } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('stored_code_verifier', codeVerifier, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
}
