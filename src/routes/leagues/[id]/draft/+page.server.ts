import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
	const myTeam = league?.teams?.find((team) => team.user_id === event.locals.user!!.id);

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
		league: JSON.parse(JSON.stringify(league)),
		myTeam: JSON.parse(JSON.stringify(myTeam))
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return fail(401, {});
		}
		const userId = event.locals.user.id;

		const formData = await event.request.formData();
		const golfers = formData.get('golfers')?.toString();

		if (!golfers) {
			return fail(400, {
				message: 'Invalid golfers sent, no data.',
				draft_error: true
			});
		}

		const golferData: [Golfer] = JSON.parse(golfers);

		if (golferData.length < 5) {
			return fail(400, {
				message: 'You must draft 6 players.',
				draft_error: true
			});
		}

		await League.updateOne(
			{ 'teams.user_id': userId },
			{
				$set: {
					'teams.$.golfers': golferData
				}
			}
		);

		return redirect(302, `/leagues/${event.params.id}`);
	}
};
