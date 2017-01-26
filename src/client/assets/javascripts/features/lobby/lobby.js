// @flow

import { createStructuredSelector } from 'reselect';

export const selector = createStructuredSelector({
  lobby: state => state.lobby,
  users: state => state.users,
  games: state => state.games
});
