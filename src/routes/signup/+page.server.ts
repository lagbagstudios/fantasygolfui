import { User, generateEmailVerificationCode, lucia } from '$lib/server/auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { validateEmail, validatePassword } from '$lib/util/validationUtil';
import { sendEmailVerification } from '$lib/util/emailUtil';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const givenName = formData.get('givenName');

		if (!validateEmail(email)) {
			return fail(400, {
				email,
				message: 'Invalid email address',
				email_error: true
			});
		}

		const emailString = email?.toString() || '';
		const givenNameString = givenName?.toString() || '';

		if (givenNameString === '') {
			return fail(400, {
				email,
				message: 'Please enter your first name',
				name_error: true
			});
		}

		if (!validatePassword(password)) {
			return fail(400, {
				email,
				message: 'Passwords must be at least 6 characters',
				password_error: true
			});
		}

		const existingUser = await User.findOne({ email: { $eq: emailString } });

		if (existingUser) {
			return fail(400, {
				email,
				message: 'User already exists with this email',
				email_error: true
			});
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password?.toString() || '');

		await User.insertOne({
			_id: userId,
			email: emailString,
			hashed_password: hashedPassword,
			given_name: givenNameString,
			google_id: 0,
			email_verified: false
		});

		const verificationCode = await generateEmailVerificationCode(userId, emailString);
		await sendEmailVerification(emailString, verificationCode);

		const session = await lucia.createSession(userId, {
			email: emailString,
			givenName: givenNameString
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
