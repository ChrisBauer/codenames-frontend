/**
 * Created by chris on 1/9/17.
 */

import {objectWithout} from 'utils/utils';
import {gameCanStart} from 'utils/validators';

export const ADD_PLAYERS = 'codenames/actions/players/addPlayers';
export const REMOVE_PLAYERS = 'codenames/actions/players/removePlayers';
export const CHANGE_TEAM = 'codenames/actions/players/changeTeam';
export const CHANGE_ROLE = 'codenames/actions/players/changeRole';
export const SET_READY = 'codenames/actions/players/setReady';

export const createPlayerFromUser = (userId) => ({
  userId,
  team: 'RED',
  role: 'GUESSER',
  ready: false
});

const resetReady = (players) => {
  const resetPlayers = Object.assign({}, players);
  Object.keys(resetPlayers).forEach(id => resetPlayers[id].ready = false);
  return resetPlayers;
};

export const delegate = (state, action) => {
  const gameId = state.currentGameId;
  if (gameId == null) {
    return state;
  }
  const game = Object.assign({}, state.games[gameId]);
  action.player = game.players[action.userId];
  game.players = reducer(game.players, action);

  if (action.type == SET_READY && gameCanStart(game.players)) {
    game.status = 'IN_PROGRESS';
  }

  return {
    ...state,
    games: {
      ...state.games,
      [gameId]: game
    }
  };
};

export const reducer = (state = {}, action) => {
  const originalState = Object.assign({}, state);
  const stateCopy = resetReady(state);
  switch (action.type) {
    case ADD_PLAYERS:
      const newUsers = action.userIds.reduce((players, id) => {
        players[id] = createPlayerFromUser(id);
        return players;
      }, {});
      return {
        ...stateCopy,
        ...newUsers
      };
    case REMOVE_PLAYERS:
      return objectWithout(stateCopy, action.userIds);
    case CHANGE_TEAM:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          team: stateCopy[action.userId].team == 'RED' ? 'BLUE' : 'RED'
        }
      };
    case CHANGE_ROLE:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          role: stateCopy[action.userId].role == 'GUESSER' ? 'GIVER' : 'GUESSER'
        }
      };
    case SET_READY:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          ready: true
        }
      };
    default:
      return originalState;
  }
};

export const addPlayers = (userIds) => ({
  type: ADD_PLAYERS,
  userIds
});

export const removePlayers = (userIds) => ({
  type: REMOVE_PLAYERS,
  userIds
});

export const changeTeam = (userId) => ({
  type: CHANGE_TEAM,
  userId
});

export const changeRole = (userId) => ({
  type: CHANGE_ROLE,
  userId
});

export const setReady = (userId) => ({
  type: SET_READY,
  userId
});

export const playerActions = {
  addPlayers,
  removePlayers,
  changeTeam,
  changeRole,
  setReady
};
