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
	const auctionBoard = league?.draft_board;

	golfers.sort((a, b) => {
		if ((a?.owgr || 99999) > (b?.owgr || 99999)) {
			return 1;
		} else if ((a?.owgr || 99999) < (b?.owgr || 99999)) {
			return -1;
		} else {
			return 0;
		}
	});

	return {
		golfers: JSON.parse(JSON.stringify(golfers)),
		league: JSON.parse(JSON.stringify(league)),
		myTeam: JSON.parse(JSON.stringify(myTeam)),
		auctionBoard: JSON.parse(JSON.stringify(auctionBoard)),
		userId: event.locals.user!!.id
	};
};

export const actions: Actions = {
	submit: async (event) => {
		if (!event.locals.user) {
			return fail(401, {});
		}
		const userId = event.locals.user.id;

		const formData = await event.request.formData();
		const golfers = formData.get('golfers')?.toString();
		const draft_type = formData.get('draft_type')?.toString();
		const leagueId = event.params.id;

		if (!golfers) {
			return fail(400, {
				message: 'Invalid golfers sent, no data.',
				draft_error: true
			});
		}

		let golferData: Golfer[] = JSON.parse(golfers);

		if (draft_type === 'auction') {
			const league = await League.findOne({ _id: new ObjectId(leagueId) });
			if (!league) {
				return fail(404, {
					message: 'League not found',
					league_error: true
				});
			}

			let currentBid = 0;
			golferData = golferData
				.filter((golfer) => golfer.current_bid !== 0)
				.map((golfer) => {
					currentBid = parseInt(golfer.current_bid?.toString() || '0');
					golfer.winning_bid = currentBid;
					golfer.winning_bidder_id = userId;

					return golfer;
				});

			const mergedGolfers = league.draft_board?.map((existingGolfer) => {
				const golfer = golferData.find((g) => g.golfer_id === existingGolfer.golfer_id);
				if (golfer && (golfer.winning_bid ?? 0) > (existingGolfer.winning_bid ?? 1)) {
					return { ...existingGolfer, ...golfer };
				}
				return existingGolfer;
			});

			golferData = golferData.map((golfer) => {
				golfer.current_bid = parseInt(golfer.winning_bid?.toString() || '0');
				golfer.current_bidder_id = userId;

				return golfer;
			});

			await League.updateOne(
				{ _id: new ObjectId(leagueId), 'teams.user_id': userId },
				{
					$set: { draft_board: mergedGolfers, 'teams.$.bids': golferData }
				}
			);

			return {
				golferData
			};
		} else if (draft_type === 'manual') {
			if (golferData.length < 6) {
				return fail(400, {
					message: 'You must draft 6 players.',
					draft_error: true
				});
			}
			await League.updateOne(
				{ _id: new ObjectId(leagueId), 'teams.user_id': userId },
				{
					$set: {
						'teams.$.golfers': golferData
					}
				}
			);
			return redirect(302, `/leagues/${event.params.id}`);
		}
	},
	end_auction_round: async (event) => {
		// put all winning bids on the respective teams
		// remove all winning bids from the draft board
		// set the current_bid to 0 for all golfers
		// reset bids for each team
		const leagueId = event.params.id;
		return {};
	}
};
