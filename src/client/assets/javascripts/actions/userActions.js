/**
 * Created by chris on 1/7/17.
 */

import horizonRedux from 'app/horizon/redux';

const LOGIN_USER = 'codenames/actions/user/loginUser';
const LOGOUT_CURRENT_USER = 'codenames/actions/user/logoutCurrentUser';
const SET_CURRENT_USER = 'codenames/actions/user/setCurrentUser';
const UPDATE_USERS = 'codenames/actions/user/updateUsers';

const WATCH_USERS = 'codenames/actions/user/watchUsers';

horizonRedux.takeLatest(
  LOGIN_USER,
  (horizon, action) =>
    horizon('activeUsers').store({username: action.username}),
  (response, action, dispatch) => {
    dispatch(setCurrentUser(response.id));
    dispatch(watchUsers());
  },
  (err, action, dispatch) => {
    console.err('failed to add user', err);
  }
);

horizonRedux.takeLatest(
  LOGOUT_CURRENT_USER,
  (horizon, action, getState) => {
    const currentUserId = getState().users.currentUserId;
    if (currentUserId) {
      horizon('activeUsers').remove({id: currentUserId});
    }
  },
  (response, action, dispatch) => {
    dispatch(setCurrentUser(null));
  },
  (err) => {
    console.err('failed to log out', err);
  }
);

horizonRedux.takeLatest(
  WATCH_USERS,
  (horizon, action) =>
    horizon('activeUsers').order('username').limit(100).watch(),
  (result, action, dispatch) => {
    const users = result.reduce((acc, user) => {acc[user.id] = user; return acc;}, {});
    dispatch(updateUsers(users));
  },
  (err) => {
    console.err('failed to load users', err);
  }
);

const initialState = {
  currentUserId: null,
  users: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUserId: action.id
      };
    case UPDATE_USERS:
      return {
        ...state,
        users: action.users
      };

    default:
      return state;
  }
};
export const loginUser = (username) => ({
  type: LOGIN_USER,
  username
});

export const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

export const setCurrentUser = (id) => ({
  type: SET_CURRENT_USER,
  id
});

export const updateUsers = (users) => ({
  type: UPDATE_USERS,
  users
});

export const userActions = {
  loginUser,
  logoutCurrentUser,
  setCurrentUser,
  updateUsers,
};



// INTERNAL ONLY ACTIONS:

export const watchUsers = () => ({
  type: WATCH_USERS
});
