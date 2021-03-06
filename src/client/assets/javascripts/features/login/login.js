/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';

export const selector = createStructuredSelector({
  users: state => state.users.users,
  currentUserId: state => state.users.currentUserId
});
