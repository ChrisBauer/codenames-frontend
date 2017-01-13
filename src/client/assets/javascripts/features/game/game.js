/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';

export const selector = createStructuredSelector({
  game: state => state.game,
  users: state => state.users
});
