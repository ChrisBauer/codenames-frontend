/**
 * Created by chris on 1/7/17.
 */

import horizonRedux from 'app/horizon/redux';
import {Observable} from 'rxjs';
import {GameStatus} from 'models/game';
import {getCurrentUserId, getUsers, getCurrentGameId, getGames, getGame, getPlayersWithoutUser, getPlayersPlusPlayer} from 'utils/stateTraversal';
import {gameCanStart} from 'utils/validators';

const CREATE_GAME = 'codenames/actions/game/createGame';
const UPDATE_GAMES = 'codenames/actions/game/updateGames';
const LEAVE_CURRENT_GAME = 'codenames/actions/game/leaveCurrentGame';
const SELECT_GAME = 'codenames/actions/game/selectGame';
const SET_CURRENT_GAME = 'codenames/actions/game/setCurrentGame';

const WATCH_GAMES = 'codenames/actions/game/watchGames';

import { createPlayerFromUser } from 'actions/playerActions';
import { PASS, GUESS, GIVE_CLUE, delegate as delegateToGameplayReducer } from 'actions/gameplayActions';

horizonRedux.takeLatest(
  CREATE_GAME,
  (horizon, action) => {
    const game = createNewGame(action.userId, action.name);
    return horizon('games').store(game);
  },
  (response, action, dispatch) => dispatch(setCurrentGame(response.id)),
  err => console.err('failed to create game', err)
);

horizonRedux.takeLatest(
  WATCH_GAMES,
  (horizon, action) =>
    horizon('games').order('name').limit(100).watch(),
  (result, action, dispatch) => {
    const games = result.reduce((acc, game) => {acc[game.id] = game; return acc;}, {});
    dispatch(updateGames(games));
  },
  err => console.err('failed to fetch games', err)
);

horizonRedux.takeLatest(
  LEAVE_CURRENT_GAME,
  (horizon, action, getState) => {
    const state = getState();
    const gameId = getCurrentGameId(state);
    const userId = getCurrentUserId(state);
    if (!gameId || !userId || !getGame(state, gameId)) {
      return Observable.empty();
    }

    // This logic should probably be moved to the server.
    const newPlayers = getPlayersWithoutUser(state, gameId, userId);

    // If there are no players left after removing the current player, delete the game.
    if (Object.keys(newPlayers).length == 0) {
      return horizon('games').remove({id: gameId});
    }

    // Note that we can't remove one key from a nested field, so we have to replace the whole
    // object without the player
    const game = getGame(state, gameId);

    // If the leaving player means that the game can no longer exist, set the game to error state
    if (game.status == GameStatus.IN_PROGRESS && !gameCanStart(newPlayers)) {
      game.status = GameStatus.ERROR;
      game.players = {};
      return horizon('games').replace(game);
    }
    game.players = newPlayers;
    return horizon('games').replace(game);
  },
  (result, action, dispatch) => dispatch(setCurrentGame(null)),
  err => console.err('failed leaving game', err)
);

horizonRedux.takeLatest(
  SELECT_GAME,
  (horizon, action, getState) => {
    const state = getState();
    const userId = getCurrentUserId(state);
    const game = getGame(state, action.gameId);
    if (!userId || !game) {
      return Observable.empty();
    }
    const newPlayer = createPlayerFromUser(userId);
    // Note that update effectively does a merge, so we don't need to merge the players
    return horizon('games').update({id: action.gameId, players: {[userId]: newPlayer}});
  },
  (result, action, dispatch) => dispatch(setCurrentGame(result.id)),
  err => console.err('failed joining game', err)
);

const createNewGame = (userId, name) => ({
  name: name,
  status: GameStatus.PENDING,
  players: {
    [userId]: createPlayerFromUser(userId)
  },
  play: {}
});

const initialState = {
  currentGameId: null,
  games: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_GAME:
      return {
        ...state,
        currentGameId: action.gameId
      };

    case UPDATE_GAMES:
      return {
        ...state,
        games: action.games
      };

    default:
      return state;
  }
};

export const createGame = (userId, name) => ({
  type: CREATE_GAME,
  userId,
  name
});

export const setCurrentGame = (gameId) => ({
  type: SET_CURRENT_GAME,
  gameId
});

export const updateGames = (games) => ({
  type: UPDATE_GAMES,
  games
});

export const leaveCurrentGame = () => ({
  type: LEAVE_CURRENT_GAME
});

export const selectGame = (gameId) => ({
  type: SELECT_GAME,
  gameId
});

const watchGames = () => ({
  type: WATCH_GAMES
});

export const gameActions = {
  createGame,
  updateGames,
  leaveCurrentGame,
  selectGame,
  watchGames
};


// INTERNAL ONLY ACTION CREATORS
