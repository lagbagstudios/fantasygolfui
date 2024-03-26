import { lucia, User } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { validateEmail, validatePassword } from '$lib/util/validationUtil';
import type { Actions } from './$types';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!validateEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		const emailString = email?.toString();
		const passwordString = password?.toString();

		const existingUser = await User.findOne({ email: { $eq: emailString } });

		if (!existingUser) {
			return fail(400, {
				message: 'Incorrect email or password.',
				incorrect: true
			});
		}

		// if (existingUser.google_id) {
		// 	return fail(400, {
		// 		message: 'You must login with Google.',
		// 		incorrect: true
		// 	});
		// }

		const validPassword = await new Argon2id().verify(
			existingUser.hashed_password,
			passwordString || ''
		);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect email or password.',
				incorrect: true
			});
		}

		const session = await lucia.createSession(existingUser._id, {
			email: existingUser.email,
			givenName: existingUser.given_name
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/leagues');
	}
};
