// @flow

import { createStructuredSelector } from 'reselect';
import without from 'lodash/without';
import union from 'lodash/union';

import { LobbyState } from 'models/states';
import { User, createPlayerFromUser } from 'models/user';
import { GameInfo } from 'models/game';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const ADD_USERS = 'codenames/lobby/ADD_USERS';
const REMOVE_USERS = 'codenames/lobby/REMOVE_USERS';
const ADD_GAMES = 'codenames/lobby/ADD_GAMES';
const REMOVE_GAMES = 'codenames/lobby/REMOVE_GAMES';
// add logout to login section

// This will be used in our root reducer and selectors

export const NAME = 'lobby';

// Define the initial state for `lobby` module

const initialState: LobbyState = {
  users: [],
  games: []
};

let gameId = 0;

export function createNewGame (user: User, name: ?string): GameInfo {
  return {
    name: name ? name : 'Game ' + gameId,
    id: gameId++,
    players: [createPlayerFromUser(user)],
    status: 'PENDING'
  };
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

export default function reducer(state: LobbyState = initialState, action: any = {}): LobbyState {
  switch (action.type) {
    case ADD_USERS: {
      console.log('in lobby - add user');
      return {
        ...state,
        users: union(state.users, action.users)
      };
    }

    case REMOVE_USERS:
      return {
        ...state,
        // TODO: Ensure without works with array params
        users: without(state.users, ...action.users)
      };

    case ADD_GAMES: {
      // TODO: flesh out the method bodies
      return {
        ...state,
        games: union(state.games, action.games)
      };
    }

    case REMOVE_GAMES:
      return {
        ...state,
        games: without(state.games, ...action.games)
      };

    default:
      return state;
  }
}

// Action Creators

const addUsersLobby = (users: [User]) => {
  console.log('in addUser action creator');
  console.log(users);
  return {
    type: ADD_USERS,
    users
  };
};

const removeUsersLobby = (users: [User]) => ({
  type: REMOVE_USERS,
  users
});

const addGames = (games: [Game]) => ({
  type: ADD_GAMES,
  games
});

const removeGames = (games: [Game]) => ({
  type: REMOVE_GAMES,
  games
});

export const selector = createStructuredSelector({
  lobby: state => state['lobby'],
  login: state => state['login']
});

export const actionCreators = {
  addUsersLobby,
  removeUsersLobby,
  addGames,
  removeGames
};
