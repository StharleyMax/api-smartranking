import { Document } from 'mongoose';

import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  dateTime: Date;
  dateTimeRequest: Date;
  dateTimeResponse: Date;
  status: string;
  challenging: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result;
}

export interface Result {
  set: string;
}
