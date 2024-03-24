import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GolferTable } from '$lib/server/golfers';
import { League } from '$lib/server/league';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (!ObjectId.isValid(event.params.id)) {
		return {};
	}

	const golfers = await GolferTable.find().toArray();
	const league = await League.findOne({ _id: new ObjectId(event.params.id) });

	golfers.sort((a, b) => {
		if ((a?.price || 99999) < (b?.price || 99999)) {
			return 1;
		} else if ((a?.price || 0) > (b?.price || 0)) {
			return -1;
		} else {
			return 0;
		}
	});

	return {
		golfers: JSON.parse(JSON.stringify(golfers)),
		league: JSON.parse(JSON.stringify(league))
	};
};
