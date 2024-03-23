import { ObjectId } from 'mongodb';
import db from './db';
import { alphabet, generateRandomString } from 'oslo/crypto';

export const League = db.collection<League>('leagues');

export const createLeague = async (
	userId: string,
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
		teams: [{ user_id: userId }]
	});
};

interface League {
	_id: ObjectId;
	owner_id: string;
	join_code: string;
	is_private: boolean;
	league_password?: string;
	league_name: string;
	teams?: [Team];
}

interface Team {
	user_id: string;
	golfers?: [Golfer];
}

interface Golfer {
	golfer_id: string;
	first_name: string;
	last_name: string;
	score: number;
}
