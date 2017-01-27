/**
 * Created by chris on 1/8/17.
 */

import {CardColor, CardState} from 'models/card';
import {Roles, GameStatus} from 'models/game';

export const validateUser = (users, currentUserId) => {
  return currentUserId != null && users[currentUserId];
};

export const validateGameForStaging = (games, currentGameId, currentUserId) => {
  return (currentGameId != null && currentUserId != null && games[currentGameId] &&
      games[currentGameId].status == GameStatus.PENDING &&
      games[currentGameId].players[currentUserId]);
};

export const isAdminUser = (users, userId) => {
  return users && userId && users[userId] && users[userId].username == 'nimda';
};

export const checkForVictory = (board) => {
  const redVictory = board.filter(card => card.color == CardColor.RED).every(card => card.status == CardState.GUESSED);
  const blueVictory = board.filter(card => card.color == CardColor.BLUE).every(card => card.status == CardState.GUESSED);

  if (redVictory && blueVictory) {
    throw new Error('Both teams match victory condition - how can this be?!');
  }
  if (!redVictory && !blueVictory) {
    return null;
  }

  // At this point we know that one is true and one is false.
  return redVictory ? CardColor.RED : CardColor.BLUE;
};

const getTeams = (players) => {
  return Object.keys(players).reduce((teams, id) => {
    if (!players[id].ready) {
      throw 'at least one player was not ready';
    }
    teams[players[id].team][id] = players[id];
    return teams;
  }, {red: {}, blue: {}});
};

export const gameCanStart = (players) => {
  let teams;
  try {
    teams = getTeams(players);
  }
  catch (ex) {
    // there must have been an error. Return false.
    return false;
  }
  // Need at least 4 players
  if (Object.keys(teams.red).length + Object.keys(teams.blue).length < 4) {
    return false;
  }
  // Need at least 2 on each team
  if (Object.keys(teams.red).length < 2) {
    return false;
  }
  if (Object.keys(teams.blue).length < 2) {
    return false;
  }
  // Need one and only one GIVER per team.
  if (Object.keys(teams.red).filter(id => teams.red[id].role == Roles.GIVER).length != 1) {
    return false;
  }
  if (Object.keys(teams.blue).filter(id => teams.blue[id].role == Roles.GIVER).length != 1) {
    return false;
  }

  // If all of these checks have passed then ogogogogogog.
  return true;
};
