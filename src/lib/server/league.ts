import { ObjectId } from 'mongodb';
import db from './db';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { GolferTable } from './golfers';

export const League = db.collection<League>('leagues');

export const getDefaultTeamName = (givenName: string): string => {
	return `${givenName}'s Team`;
};

export enum DraftType {
	Manual = 'manual',
	Auction = 'auction'
}

export const createLeague = async (
	userId: string,
	givenName: string,
	name: string,
	isPrivate: boolean,
	leaguePassword?: string,
	draftType: DraftType = DraftType.Manual,
	budget: number = 1000
) => {
	const _id = new ObjectId();
	const join_code = generateRandomString(4, alphabet('0-9'));

	const golfers: Golfer[] = await GolferTable.find().toArray();

	await League.insertOne({
		_id,
		owner_id: userId,
		join_code,
		is_private: isPrivate,
		league_name: name,
		league_password: leaguePassword,
		teams: [{ user_id: userId, team_name: getDefaultTeamName(givenName) }],
		draft_type: draftType,
		budget: budget,
		draft_board: golfers
	});
};
