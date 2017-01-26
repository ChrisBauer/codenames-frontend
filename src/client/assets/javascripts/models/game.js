/**
 * Created by chris on 1/3/17.
 */

import {Player} from './user';
import {Card} from './card';
import {Team} from './user';

export type GameStatus =
 | "PENDING" | "IN PROGRESS" | "COMPLETED"

export type GameInfo = {
  id: number,
  name: string,
  players: [Player],
  status: GameStatus
};

export const Teams = {
  RED: 'red',
  BLUE: 'blue'
};

export type Board = {
  board: [Card]   // cards laid out as a list:
                  // 0 1 2 3 4
                  // 5 6 7 8 9
                  // etc.
}

export type Action =
 | "PASS" | "GUESS"

export type Turn = {
  team: Team,
  action: Action,   // if action was "GUESS", card must be specified
  card: ?Card       // card that was chosen
}

export type Game = {
  info: GameInfo,
  board: Board,
  nextTurn: Team,
  moves: [Turn]
}
