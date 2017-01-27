/**
 * Created by chris on 1/26/17.
 */

import horizonRedux from 'app/horizon/redux';
import {Observable} from 'rxjs';
import {isAdminUser} from 'utils/validators';
import {getCurrentUserId, getUser, getUsers} from 'utils/stateTraversal';

const REMOVE_USERS = 'codenames/actions/admin/removeUsers';
const REMOVE_GAMES = 'codenames/actions/game/removeGames';

horizonRedux.takeLatest(
  REMOVE_USERS,
  (horizon, action, getState) => {
    const state = getState();
    const currentUserId = getCurrentUserId(state);

    if (!isAdminUser(getUsers(state), currentUserId)) {
      return Observable.empty();
    }
    if (action.userIds) {
      return horizon('activeUsers').removeAll(action.userIds.filter(id => id != currentUserId));
    }
    return horizon('activeUsers').removeAll(Object.keys(state.users.users).filter(id => id != currentUserId));
  }
);

horizonRedux.takeLatest(
  REMOVE_GAMES,
  (horizon, action, getState) => {
    const state = getState();
    const currentUserId = getCurrentUserId(state);

    if (!isAdminUser(getUsers(state), currentUserId)) {
      return Observable.empty();
    }
    if (action.gameIds) {
      return horizon('games').removeAll(action.gameIds);
    }
    return horizon('games').removeAll(Object.keys(state.games.games));
  }
);

const removeUsers = userIds => ({
  type: REMOVE_USERS,
  userIds
});

const removeGames = gameIds => ({
  type: REMOVE_GAMES,
  gameIds
});

export const adminActions = {
  removeUsers,
  removeGames
};
