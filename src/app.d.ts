import type { ObjectId } from 'mongodb';

declare global {
	declare namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}
	interface League {
		_id: ObjectId;
		owner_id: string;
		join_code: string;
		is_private: boolean;
		league_password?: string;
		league_name: string;
		teams?: [Team];
		budget?: number;
		draft_type?: DraftType;
		draft_board?: Golfer[];
	}

	interface Team {
		user_id: string;
		team_name: string;
		golfers?: Golfer[];
		bids?: Golfer[];
	}

	interface Golfer {
		golfer_id?: string;
		slashgolf_id?: string;
		first_name: string;
		last_name: string;
		score?: number;
		r1_score?: number;
		r2_score?: number;
		r3_score?: number;
		r4_score?: number;
		price?: number;
		owgr?: number;
		current_bid?: number;
		current_bidder_id?: string;
		winning_bid?: number;
		winning_bidder_id?: string;
	}
}

export {};
