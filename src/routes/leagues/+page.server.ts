import { League } from '$lib/server/league';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const userId = event.locals.user.id;
	const ownedLeagues = await League.find({ owner_id: userId }).toArray();

	const joinedLeagues = await League.find({
		'teams.user_id': userId,
		owner_id: { $ne: userId }
	}).toArray();

	return {
		ownedLeagues: JSON.parse(JSON.stringify(ownedLeagues)),
		joinedLeagues: JSON.parse(JSON.stringify(joinedLeagues))
	};
};
