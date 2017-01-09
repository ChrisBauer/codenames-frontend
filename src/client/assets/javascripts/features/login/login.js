/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';

import { LoginState } from 'models/states';
import { User } from 'models/user';

// Action Types

const LOGIN = 'codenames/login/LOGIN';
const LOGOUT = 'codenames/login/LOGOUT';

// This will be used in our root reducer and selectors

export const NAME = 'login';

// Define the initial state for `login` module

const initialState = null;

let userId = 0;

function createNewUser(username: string): User {
  return {
    username: username,
    id: userId++
  }
}

// Reducer

/**
 * Another clever approach of writing reducers:
 *
 * export default function(state = initialState, action) {
 *   const actions = {
 *      [ACTION_TYPE]: () => [action.payload.data, ...state]
 *   };
 *
 *   return (_.isFunction(actions[action.type])) ? actions[action.type]() : state
 * }
 */

export default function reducer(state = initialState, action: any = {}): LoginState {
  switch (action.type) {
    case LOGIN: {
      const user = createNewUser(action.username);
      return user.id;
    }

    case LOGOUT:
      return null;

    default:
      return state;
  }
}

// Action Creators

const loginAction = (username: string) => ({
  type: LOGIN,
  username
});

const logoutAction = () => ({
  type: LOGOUT
});

export const selector = createStructuredSelector({
  currentUserId: (state) => state['currentUserId'],
  login: (state) => state['login']
});

export const actionCreators = {
  login: loginAction,
  logout: logoutAction
};
