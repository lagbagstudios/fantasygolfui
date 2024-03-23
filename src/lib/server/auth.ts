import { Lucia, generateId } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { ObjectId } from 'mongodb';
import db from './db';
import { dev } from '$app/environment';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { alphabet, generateRandomString, sha256 } from 'oslo/crypto';
import { TimeSpan, createDate } from 'oslo';
import { encodeHex } from 'oslo/encoding';

export const User = db.collection<UserDoc>('users');
const Session = db.collection<SessionDoc>('sessions');
export const EmailVerification = db.collection<EmailVerification>('email_verification');
export const PasswordReset = db.collection<PasswordReset>('password_reset');

export const adapter = new MongodbAdapter(Session, User);

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			googleId: attributes.google_id,
			givenName: attributes.given_name,
			emailVerified: attributes.email_verified
		};
	}
});

export const generateEmailVerificationCode = async (
	userId: string,
	email: string
): Promise<string> => {
	await EmailVerification.deleteMany({ user_id: { $eq: userId } });
	const code = generateRandomString(8, alphabet('0-9'));
	const _id = new ObjectId();
	await EmailVerification.insertOne({
		_id,
		user_id: userId,
		email,
		code,
		expires_at: createDate(new TimeSpan(15, 'm'))
	});
	return code;
};

export const createPasswordResetToken = async (userId: string): Promise<string> => {
	await PasswordReset.deleteMany({ user_id: { $eq: userId } });
	const tokenId = generateId(40);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

	await PasswordReset.insertOne({
		token_hash: tokenHash,
		user_id: userId,
		expires_at: createDate(new TimeSpan(2, 'h'))
	});

	return tokenId;
};

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface UserDoc {
	_id: string;
	email: string;
	google_id: number;
	given_name: string;
	hashed_password: string;
	email_verified: boolean;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

interface EmailVerification {
	_id: ObjectId;
	code: string;
	user_id: string;
	email: string;
	expires_at: Date;
}

interface PasswordReset {
	token_hash: string;
	user_id: string;
	expires_at: Date;
}

interface DatabaseUserAttributes {
	email: string;
	google_id: number;
	given_name: string;
	hashed_password: string;
	email_verified: boolean;
}
