/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';

export const selector = createStructuredSelector({
  games: state => state.games,
  users: state => state.users
});
