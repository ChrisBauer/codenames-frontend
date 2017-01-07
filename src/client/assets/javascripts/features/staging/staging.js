/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';
import without from 'lodash/without';
import union from 'lodash/union';

import { StagingState } from 'models/states';
import { User, Player, Team } from 'models/user';
import { GameInfo } from 'models/game';
import { Card, Board, wordList} from 'models/card';

// Action Types

const POPULATE_STAGING = 'codenames/staging/POPULATE_STAGING';
const ADD_THIS_PLAYER = 'codenames/staging/ADD_THIS_PLAYER';
const ADD_PLAYERS = 'codenames/staging/ADD_PLAYERS';
const REMOVE_PLAYERS = 'codenames/staging/REMOVE_PLAYERS';
const CHANGE_TEAM = 'codenames/staging/CHANGE_TEAM';
const CHANGE_ROLE = 'codenames/staging/CHANGE_ROLE';
const READY = 'codenames/staging/READY';

// This will be used in our root reducer and selectors

export const NAME = 'staging';

// Define the initial state for `staging` module

const initialState: StagingState = {
  players: [],
  gameInfo: {},
  readyPlayers: []
};

// TODO: The server should validate this too
function checkTeamsAndRoles (state: StagingState): boolean {
  // Need at least 4 players
  if (state.players.length < 3) {
    return false;
  }
  const redTeam = players.filter(player => player.team == 'RED');
  if (redTeam.length < 2) {
    return false;
  }
  if (redTeam.filter(red => red.role == 'GIVER').length != 1) {
    return false;
  }
  const blueTeam = players.filter(player => player.team == 'BLUE');
  if (blueTeam.length < 2) {
    return false;
  }
  if (blueTeam.filter(blue => blue.role == 'GIVER').length != 1) {
    return false;
  }

  // If all of these checks have passed then ogogogogogog.
  return true;
}

function createNewPlayerFromUser(user: User) : Player {
  return {
    user: user,
    team: 'RED',
    role: 'GUESSER'
  };
}

function createBoard(firstTeam: ?Team): Board{
  // pick 25 random words
  // if team passed, that one gets the extra
  // otherwise, flip a coin.
  // 8 RED, 8 BLUE, 1 BLACK, 1 RED|BLUE, 8 BROWN
  // return the board
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

export default function reducer(state: StagingState = initialState, action: any = {}): GameState {
  let playerIndex;
  switch (action.type) {
    case POPULATE_STAGING: {
      return {
        players: action.players,
        gameInfo: {},
        readyPlayers: []
      };
    }

    case ADD_THIS_PLAYER:
      // If this player already exists, return the state
      if (state.players.find(player => player.user.id == action.user.id)) {
        return state;
      }
      // Otherwise create a new player
      return {
        ...state,
        players: [...state.players, createNewPlayerFromUser(action.user)]
      };

    case ADD_PLAYERS:
      return {
        ...state,
        players: union(state.players, action.players)
      };

    case REMOVE_PLAYERS:
      return {
        ...state,
        players: without(state.players, ...action.players)
      };

    case CHANGE_TEAM:
      playerIndex = state.players.findIndex(player => player.user.id == action.player.user.id);
      if (playerIndex == -1) {
        return state;
      }

      return {
        ...state,
        readyPlayers: [], // Reset the "ready" players
        players: [
          ...state.players.slice(0, playerIndex),
          {...action.player, team: action.team}, // Here's where we change the team
          ...state.players.slice(playerIndex + 1)
        ]
      };

    case CHANGE_ROLE:
      playerIndex = state.players.findIndex(player => player.user.id == action.player.user.id);
      if (playerIndex == -1) {
        return state;
      }

      return {
        ...state,
        readyPlayers: [], // Reset the "ready" players
        players: [
          ...state.players.slice(0, playerIndex),
          {...action.player, role: action.role}, // Here's where we change the role
          ...state.players.slice(playerIndex + 1)
        ]
      };

    case READY:
      if (!checkTeamsAndRoles(state)) {
        console.log(`invalid team/roles - couldn't set ready`);
        return state;
      }
      const newState = {
        ...state,
        readyPlayers: union(state.readyPlayers, [action.player])
      };

      if (newState.players.length == newState.readyPlayers.length) {
        // Change this game's status
        console.log('OGOGOGOGOGOG');
      }
      return newState;

    default:
      return state;
  }
}

// Action Creators

const populateStaging = (gameInfo: GameInfo, players: [Player]) => ({
  type: POPULATE_STAGING,
  gameInfo,
  players
});

const addThisPlayer = (user: User) => ({
  type: ADD_THIS_PLAYER,
  user
});

const addPlayers = (players: [Player]) => ({
  type: ADD_PLAYERS,
  players
});

const removePlayers = (players: [Player]) => ({
  type: REMOVE_PLAYERS,
  players
});

const changeTeam = (player: Player, team: Team) => ({
  type: CHANGE_TEAM,
  player,
  team
});

const changeRole = (player: Player, role: Role) => ({
  type: CHANGE_ROLE,
  player,
  role
});

const ready = (player: Player) => ({
  type: READY,
  player
});

export const selector = createStructuredSelector({
  staging: state => state[NAME],
  login: state => state['login']
});

export const actionCreators = {
  populateStaging,
  addThisPlayer,
  addPlayers,
  removePlayers,
  changeTeam,
  changeRole,
  ready
};
