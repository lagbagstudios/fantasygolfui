import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { Collection } from 'mongodb';
import db from './db';
import { dev } from '$app/environment';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT } from '$env/static/private';

export const User = db.collection('users') as Collection<UserDoc>;
const Session = db.collection('sessions') as Collection<SessionDoc>;

export const adapter = new MongodbAdapter(Session, User);

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			googleEmail: attributes.google_email,
			googleId: attributes.google_id,
			givenName: attributes.given_name
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface UserDoc {
	_id: string;
	google_email: string;
	google_id: number;
	given_name: string;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

interface DatabaseUserAttributes {
	google_email: string;
	google_id: number;
	given_name: string;
}
