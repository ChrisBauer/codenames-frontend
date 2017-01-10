/**
 * Created by chris on 1/7/17.
 */

const CREATE_USER = 'codenames/actions/user/createUser';
const ADD_USERS = 'codenames/actions/user/addUsers';
const REMOVE_USERS = 'codenames/actions/user/removeUsers';
const LOGOUT_CURRENT_USER = 'codenames/actions/user/logoutCurrentUser';

let nextUserId = 0;

const createNewUser = (username) => {
  return {
    id: nextUserId++,
    username: username
  }
};

const initialState = {
  currentUserId: null,
  users: {}
};

const getUsersWithout = (users, withoutIds) => {
  const returnUsers = Object.assign({}, users);
  if (withoutIds) {
    withoutIds.forEach(id => delete returnUsers[id]);
  }
  return returnUsers;
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      const user = createNewUser(action.username);
      return {
        currentUserId: user.id,
        users: {
          ...state.users,
          [user.id]: user
        }
      };

    case ADD_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...action.users.reduce((users, user) => {
            users[user.id] = user;
            return users;
          }, {})
        }
      };

    case REMOVE_USERS:
      return {
        ...state,
        users: getUsersWithout(state.users, action.userIds)
      };

    case LOGOUT_CURRENT_USER:
      return {
        currentUserId: null,
        users: getUsersWithout(state.users, [state.currentUserId])
      };

    default:
      return state;
  }
};

export const createUser = (username) => ({
  type: CREATE_USER,
  username
});

export const addUsers = (users) => ({
  type: ADD_USERS,
  users
});

export const removeUsers = (userIds) => ({
  type: REMOVE_USERS,
  userIds
});

export const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

export const userActions = {
  createUser,
  addUsers,
  removeUsers,
  logoutCurrentUser
};
