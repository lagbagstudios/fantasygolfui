import db from './db';

export const GolferTable = db.collection<Golfer>('golfers');
