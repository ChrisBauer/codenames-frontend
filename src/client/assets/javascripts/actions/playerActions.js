/**
 * Created by chris on 1/9/17.
 */

import {objectWithout} from 'utils/utils';
import {Observable} from 'rxjs';
import horizonRedux from 'app/horizon/redux';

import {CardColor} from 'models/card';
import {Teams, Roles} from 'models/game';

import {getCurrentUserId, getUsers, getCurrentGameId, getGames, getGame,
  getGamePlayerFromUser, getPlayersWithoutUser, getPlayersPlusPlayer} from 'utils/stateTraversal';

import {delegate as gameplayDelegate, initGameplay} from './gameplayActions';

export const CHANGE_TEAM = 'codenames/actions/players/changeTeam';
export const CHANGE_ROLE = 'codenames/actions/players/changeRole';
export const SET_READY = 'codenames/actions/players/setReady';

export const createPlayerFromUser = (userId) => ({
  userId,
  team: Teams.RED,
  role: Roles.GUESSER,
  ready: false
});

const getOtherTeam = (team) => team == Teams.RED ? Teams.BLUE : Teams.RED;
const getOtherRole = (role) => role == Roles.GIVER ? Roles.GUESSER : Roles.GIVER;

const resetReady = (players) => {
  const resetPlayers = Object.assign({}, players);
  Object.keys(resetPlayers).forEach(id => resetPlayers[id].ready = false);
  return resetPlayers;
};

horizonRedux.takeLatest(
  CHANGE_TEAM,
  (horizon, action, getState) => {
    const state = getState();
    const userId = getCurrentUserId(state);
    const gameId = getCurrentGameId(state);
    if (!userId || !gameId) {
      return Observable.empty();
    }

    const players = resetReady(getGame(state, gameId).players);

    if (!players[userId]) {
      return Observable.empty();
    }
    const player = players[userId];
    player.team = getOtherTeam(player.team);
    return horizon('games').update({id: gameId, players: {...players}});
  },
  (result, action, dispatch) => {},
  err => console.err('failed to change team', err)
);

horizonRedux.takeLatest(
  CHANGE_ROLE,
  (horizon, action, getState) => {
    const state = getState();
    const userId = getCurrentUserId(state);
    const gameId = getCurrentGameId(state);
    if (!userId || !gameId) {
      return Observable.empty();
    }

    const players = resetReady(getGame(state, gameId).players);

    if (!players[userId]) {
      return Observable.empty();
    }
    const player = players[userId];
    player.role = getOtherRole(player.role);
    return horizon('games').update({id: gameId, players: {...players}});
  },
  (result, action, dispatch) => {},
  err => console.err('failed to change role', err)
);

horizonRedux.takeLatest(
  SET_READY,
  (horizon, action, getState) => {
    const state = getState();
    const userId = getCurrentUserId(state);
    const gameId = getCurrentGameId(state);
    if (!userId || !gameId) {
      return Observable.empty();
    }

    const player = getGamePlayerFromUser(state, gameId, userId);
    player.ready = true;
    return horizon('games').update({id: gameId, players: {[userId]: player}});
  },
  (result, action, dispatch) => {
    dispatch(initGameplay(result.id));
  },
  err => console.err('failed to change team', err)
);

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
  changeTeam,
  changeRole,
  setReady
};
