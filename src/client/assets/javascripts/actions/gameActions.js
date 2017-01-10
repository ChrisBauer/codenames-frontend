/**
 * Created by chris on 1/7/17.
 */

import objectWithout from 'utils/utils';

const CREATE_GAME = 'codenames/actions/game/createGame';
const ADD_GAMES = 'codenames/actions/game/addGames';
const REMOVE_GAMES = 'codenames/actions/game/removeGames';
const LEAVE_CURRENT_GAME = 'codenames/actions/game/leaveCurrentGame';
const SELECT_GAME = 'codenames/actions/game/selectGame';

import { ADD_PLAYERS, REMOVE_PLAYERS, CHANGE_TEAM, CHANGE_ROLE, SET_READY, delegate as delegateToPlayersReducer, createPlayerFromUser } from 'actions/playerActions';
import { PASS, GUESS, GIVE_CLUE, delegate as delegateToGameplayReducer } from 'actions/gameplayActions';

let nextGameId = 0;

const createNewGame = (userId, name) => ({
  id: nextGameId++,
  name: name,
  status: 'PENDING',
  players: {
    [userId]: createPlayerFromUser(userId)
  },
  play: {},
});

const initialState = {
  currentGameId: null,
  games: {}
};

export const reducer = (state = initialState, action) => {
  let gameId;
  let game;
  switch (action.type) {
    case CREATE_GAME:
      game = createNewGame(action.userId, action.name);
      return {
        currentGameId: game.id,
        games: {
          ...state.games,
          [game.id]: game
        }
      };

    case ADD_GAMES:
      return action.games.reduce((games, game) => {
        games[game.id] = game;
        return games;
      }, state);

    case REMOVE_GAMES:
      return {
        ...state,
        games: objectWithout(state.games, action.gameIds)
      };

    case LEAVE_CURRENT_GAME:
      // If there is no currentGameId, return
      gameId = state.currentGameId;
      if (gameId == null) {
        return state;
      }

      const remainingPlayers = objectWithout(state.games[gameId].players, action.userId);

      // If this was the last player in the game, remove the game
      if (Object.keys(remainingPlayers).length == 0) {
        return {
          currentGameId: null,
          games: objectWithout(state.games, [gameId])
        };
      }

      // Otherwise, just remove this player
      return {
        currentGameId: null,
        games: {
          ...state.games,
          gameId: {
            ...state.games[gameId],
            players: remainingPlayers
          }
        }
      };

    case SELECT_GAME:
      if (!state.games[action.gameId]) {
        return state;
      }
      return {
        ...state,
        currentGameId: action.gameId
      };

    case ADD_PLAYERS:
    case REMOVE_PLAYERS:
    case CHANGE_TEAM:
    case CHANGE_ROLE:
    case SET_READY:
      return delegateToPlayersReducer(state, action);


    case GUESS:
    case PASS:
    case GIVE_CLUE:
      return delegateToGameplayReducer(state, action);

    default:
      return state;
  }
};

export const createGame = (userId, name) => ({
  type: CREATE_GAME,
  userId,
  name
});

export const addGames = (games) => ({
  type: ADD_GAMES,
  games
});

export const removeGames = (gameIds) => ({
  type: REMOVE_GAMES,
  gameIds
});

export const leaveCurrentGame = () => ({
  type: LEAVE_CURRENT_GAME
});

export const selectGame = (gameId) => ({
  type: SELECT_GAME,
  gameId
});

export const gameActions = {
  createGame,
  addGames,
  removeGames,
  leaveCurrentGame,
  selectGame
};
