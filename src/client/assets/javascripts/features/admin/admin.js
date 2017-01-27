// @flow

import { createStructuredSelector } from 'reselect';

export const selector = createStructuredSelector({
  users: state => state.users,
  games: state => state.games
});
