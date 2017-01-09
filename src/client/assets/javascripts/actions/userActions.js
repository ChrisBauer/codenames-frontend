/**
 * Created by chris on 1/7/17.
 */

const CREATE_USER = 'codenames/actions/user/createUser';
const ADD_USERS = 'codenames/actions/user/addUser';

let nextUserId = 0;

const createUser = (username) => {
  return {
    id: nextUserId++,
    username: username
  }
};

const initialState = {
  currentUserId: null,
  users: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      const user = createUser(action.username);
      return {
        currentUserId: user.id,
        users: {
          ...state.users,
          [user.id]: user
        }
      };

    case ADD_USERS:
      return action.users.reduce((users, user) => {
        users[user.id] = user;
        return users;
      }, state);

    default:
      return state;
  }
};

export const createUserAction = (username) => ({
  type: CREATE_USER,
  username
});
