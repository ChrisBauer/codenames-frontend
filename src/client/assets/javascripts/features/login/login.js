/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';
import { User } from 'models/user';

export const selector = createStructuredSelector({
  currentUserId: (state) => state.currentUserId
});
