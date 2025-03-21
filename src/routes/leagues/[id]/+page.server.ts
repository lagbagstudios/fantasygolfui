import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { League } from '$lib/server/league';
import { ObjectId } from 'mongodb';
import { updateGolferScores } from '$lib/server/golfers';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, '/login');

	if (!ObjectId.isValid(event.params.id)) {
		return {
			not_found: true,
			message: 'League could not be found'
		};
	}

	const league = await League.findOne({
		_id: new ObjectId(event.params.id),
		'teams.user_id': event.locals.user!!.id
	});

	if (!league) {
		return {
			not_found: true,
			message: 'League could not be found'
		};
	}

	const draftEligible = new Date() < new Date('2025-04-10');

	await updateGolferScores();

	return {
		league: JSON.parse(JSON.stringify(league)),
		userId: event.locals.user!!.id,
		draftEligible
	};
};

export const actions: Actions = {
	team: async (event) => {
		const formData = await event.request.formData();
		const teamName = formData.get('team_name');
		const userId = event.locals.user!!.id;
		const leagueId = event.params.id;

		if (typeof teamName !== 'string' || teamName === '') {
			return fail(400, {
				message: 'Invalid Team Name',
				name_error: true
			});
		}

		await League.updateOne(
			{
				_id: new ObjectId(leagueId),
				'teams.user_id': userId
			},
			{
				$set: {
					'teams.$.team_name': teamName
				}
			}
		);
	},
	leave: async (event) => {
		const leagueId = event.params.id;
		const userId = event.locals.user!!.id;

		await League.updateOne(
			{
				_id: new ObjectId(leagueId),
				owner_id: { $ne: userId }
			},
			{
				$pull: {
					teams: {
						user_id: userId
					}
				}
			}
		);

		return redirect(302, '/leagues');
	},
	close: async (event) => {
		const leagueId = event.params.id;
		const userId = event.locals.user!!.id;

		await League.deleteOne({ _id: new ObjectId(leagueId), owner_id: userId });

		return redirect(302, '/leagues');
	}
};
