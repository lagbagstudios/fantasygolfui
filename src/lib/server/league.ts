import { ObjectId } from 'mongodb';
import db from './db';
import { alphabet, generateRandomString } from 'oslo/crypto';

export const League = db.collection<League>('leagues');

export const getDefaultTeamName = (givenName: string): string => {
	return `${givenName}'s Team`;
};

export const createLeague = async (
	userId: string,
	givenName: string,
	name: string,
	isPrivate: boolean,
	leaguePassword?: string
) => {
	const _id = new ObjectId();
	const join_code = generateRandomString(4, alphabet('0-9'));

	await League.insertOne({
		_id,
		owner_id: userId,
		join_code,
		is_private: isPrivate,
		league_name: name,
		league_password: leaguePassword,
		teams: [{ user_id: userId, team_name: getDefaultTeamName(givenName) }],
		budget: 1000
	});
};
