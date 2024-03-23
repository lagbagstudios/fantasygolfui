const validateEmail = (email: any) => {
	if (typeof email !== 'string') {
		return false;
	}
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const validatePassword = (password: any) => {
	if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		return false;
	} else {
		return true;
	}
};

export { validateEmail, validatePassword };
