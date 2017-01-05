/**
 * Created by chris on 1/3/17.
 */

import {User, Player} from './user';
import {GameInfo, Game} from './game';

export type LoginState = {
  user: User
};

export type LobbyState = {
  users: [User],
  games: [GameInfo]
}

export type StagingState = {
  players: [Player],
  gameInfo: GameInfo
}

export type GameState = {
  game: Game
}
