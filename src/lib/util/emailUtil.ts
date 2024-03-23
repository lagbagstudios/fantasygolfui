import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '$env/static/private';

const sendEmailVerification = async (email: string, code: string) => {
	sgMail.setApiKey(SENDGRID_API_KEY);
	const msg = {
		to: email,
		from: 'support@lagbag.games',
		subject: 'Verify your email address',
		html: `
		<p>Please verify your email address for LAGbag Fantasy Golf.</p>
		<p>Verification Code: <strong>${code}</strong></p>
		<p>This code is valid for 15 minutes.</p>
		 `
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log('Sent email');
		})
		.catch((e) => {
			console.log(e);
		});
};

const sendPasswordResetLink = async (email: string, link: string) => {
	sgMail.setApiKey(SENDGRID_API_KEY);
	const msg = {
		to: email,
		from: 'support@lagbag.games',
		subject: 'Password Reset Link',
		html: `
		<a href="${link}">Reset Password</a>
		<br />
		<p>If the link above does not work, you can copy the one below into a browser window.</p>
		<a href="${link}">${link}</a>
		<p>This link is valid for 2 hours.</p>
		<br />
		<p>If you did not request this, you can safely ignore it. Reach out to support@lagbag.games with any concerns.</p>
		 `
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log('Sent email');
		})
		.catch((e) => {
			console.log(e);
		});
};

export { sendEmailVerification, sendPasswordResetLink };
