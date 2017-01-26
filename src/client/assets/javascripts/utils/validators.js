/**
 * Created by chris on 1/8/17.
 */

export const validateUser = (users, currentUserId) => {
  return currentUserId != null && users[currentUserId];
};

export const validateGameForStaging = (games, currentGameId, currentUserId) => {
  return (currentGameId != null && currentUserId != null && games[currentGameId] &&
      games[currentGameId].status == 'PENDING' &&
      games[currentGameId].players[currentUserId]);
};

const getTeams = (players) => {
  return Object.keys(players).reduce((teams, id) => {
    if (!players[id].ready) {
      throw 'at least one player was not ready';
    }
    teams[players[id].team][id] = players[id];
    return teams;
  }, {RED: {}, BLUE: {}});
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
  if (Object.keys(teams.RED).length + Object.keys(teams.BLUE).length < 4) {
    return false;
  }
  // Need at least 2 on each team
  if (Object.keys(teams.RED).length < 2) {
    return false;
  }
  if (Object.keys(teams.BLUE).length < 2) {
    return false;
  }
  // Need one and only one GIVER per team.
  if (Object.keys(teams.RED).filter(id => teams.RED[id].role == 'GIVER').length != 1) {
    return false;
  }
  if (Object.keys(teams.BLUE).filter(id => teams.BLUE[id].role == 'GIVER').length != 1) {
    return false;
  }

  // If all of these checks have passed then ogogogogogog.
  return true;
};
