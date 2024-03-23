import { EmailVerification, User, generateEmailVerificationCode, lucia } from '$lib/server/auth';
import { sendEmailVerification } from '$lib/util/emailUtil';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { User as LuciaUser } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import type { PageServerLoad } from '../$types';

const verifyVerificationCode = async (user: LuciaUser, code: string): Promise<boolean> => {
	const databaseCode = await EmailVerification.findOne({ user_id: { $eq: user.id } });

	if (!databaseCode || databaseCode.code !== code) {
		return false;
	}

	await EmailVerification.deleteOne({ code: { $eq: code } });

	if (!isWithinExpirationDate(databaseCode.expires_at)) {
		return false;
	}
	if (databaseCode.email !== user.email) {
		return false;
	}

	return true;
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');
};

export const actions: Actions = {
	verify: async (event) => {
		const formData = await event.request.formData();
		const sessionId = event.cookies.get(lucia.sessionCookieName);
		if (!sessionId) {
			return fail(401, {
				message: 'You are not logged in',
				failed: true
			});
		}

		const { user } = await lucia.validateSession(sessionId);
		if (!user) {
			return fail(401, {
				message: 'You are not logged in',
				failed: true
			});
		}

		const code = formData.get('code');
		if (typeof code !== 'string') {
			return fail(400, {
				message: 'Invalid code',
				failed: true
			});
		}

		const validCode = await verifyVerificationCode(user, code);
		if (!validCode) {
			return fail(400, {
				message: 'Invalid code',
				failed: true
			});
		}

		await lucia.invalidateUserSessions(user.id);
		await User.updateOne(
			{ _id: user.id },
			{
				$set: {
					email_verified: true
				}
			},
			{ upsert: true }
		);

		const session = await lucia.createSession(user.id, {
			...user
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	},
	resend: async (event) => {
		const sessionId = event.cookies.get(lucia.sessionCookieName);
		if (!sessionId) {
			return fail(401, {
				message: 'You are not logged in',
				failed: true
			});
		}

		const { user } = await lucia.validateSession(sessionId);
		if (!user) {
			return fail(401, {
				message: 'You are not logged in',
				failed: true
			});
		}

		const verificationCode = await generateEmailVerificationCode(user.id, user.email);
		await sendEmailVerification(user.email, verificationCode);
	}
};
