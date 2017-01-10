// @flow

import { createStructuredSelector } from 'reselect';
import without from 'lodash/without';
import union from 'lodash/union';

import { LobbyState } from 'models/states';
import { User, createPlayerFromUser } from 'models/user';
import { GameInfo } from 'models/game';

export const selector = createStructuredSelector({
  lobby: state => state.lobby,
  users: state => state.users,
  games: state => state.games
});
