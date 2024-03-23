import { PasswordReset, User, lucia } from '$lib/server/auth';
import { fail, type Actions } from '@sveltejs/kit';
import { isWithinExpirationDate } from 'oslo';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const password = formData.get('password');
		const passwordMatch = formData.get('password-match');

		if (password !== passwordMatch) {
			return fail(400, {
				message: 'Passwords must match',
				match_error: true
			});
		}

		if (typeof password !== 'string' || password.length < 6) {
			return fail(400, {
				message: 'Password must be longer than 6 characters',
				password_error: true
			});
		}

		const verificationToken = event.params.token;
		const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)));
		const token = await PasswordReset.findOne({ token_hash: { $eq: tokenHash } });

		if (token) {
			PasswordReset.deleteOne({ token_hash: { $eq: tokenHash } });
		}

		if (!token || !isWithinExpirationDate(token.expires_at)) {
			return fail(400, {
				message: 'Password reset token is either invalid or expired',
				token_error: true
			});
		}

		await lucia.invalidateUserSessions(token.user_id);
		const hashedPassword = await new Argon2id().hash(password);
		await User.updateOne(
			{ _id: token.user_id },
			{
				$set: {
					hashed_password: hashedPassword
				}
			},
			{ upsert: true }
		);

		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return {
			success: true,
			message: 'Password reset successfully'
		};
	}
};
