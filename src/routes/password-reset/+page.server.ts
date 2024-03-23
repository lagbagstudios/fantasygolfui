import { BASE_URL } from '$env/static/private';
import { User, createPasswordResetToken } from '$lib/server/auth';
import { sendPasswordResetLink } from '$lib/util/emailUtil';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		if (typeof email !== 'string') {
			console.error('Bad email address');
			return { success: true, message: 'Sent password reset link' };
		}

		const user = await User.findOne({ email: { $eq: email } });
		if (!user) {
			return { success: true, message: 'Sent password reset link' };
		}

		const userId = user._id;

		const verificationToken = userId && (await createPasswordResetToken(userId));
		const verificationLink = `${BASE_URL}/password-reset/${verificationToken}`;

		await sendPasswordResetLink(email, verificationLink);
		return { success: true, message: 'Sent password reset link' };
	}
};
