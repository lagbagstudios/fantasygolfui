import { ObjectId } from 'mongodb';
import db from './db';
import { alphabet, generateRandomString } from 'oslo/crypto';

const League = db.collection<League>('leagues');

export const createLeague = async (userId: string, isPublic: boolean): Promise<string> => {
	const _id = new ObjectId();
	const join_code = isPublic ? generateRandomString(8, alphabet('0-9')) : '';

	await League.insertOne({
		_id,
		join_code,
		is_public: isPublic,
		teams: [{ user_id: userId }]
	});

	return join_code;
};

interface League {
	_id: ObjectId;
	join_code: string;
	is_public: boolean;
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
