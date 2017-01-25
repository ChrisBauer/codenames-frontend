/**
 * Created by chris on 1/24/17.
 */

export const getCurrentUserId = state => state.users.currentUserId;
export const getUsers = state => state.users.users;

export const getUser = (state, userId) => {
  if (getUsers(state) && getUsers(state)[userId]) {
    return getUsers(state)[userId];
  }
  return null;
};

export const getCurrentGameId = state => state.games.currentGameId;
export const getGames = state => state.games.games;

export const getGame = (state, gameId) => {
  if (getGames(state) && getGames(state)[gameId]) {
    return getGames(state)[gameId];
  }
  return null;
};

export const getGamePlayerFromUser = (state, gameId, userId) => {
  if (getGame(state, gameId) && getUser(state, userId)) {
    const game = getGame(state, gameId);
    return game.players[userId] || null;
  }
};

export const getPlayersPlusPlayer = (state, gameId, player) => {
  if (getGames(state, gameId) && getUser(state, player.userId)) {
    const players = Object.assign({}, getGame(state, gameId).players);
    players[player.userId] = player;
    return players;
  }
};

export const getPlayersWithoutUser = (state, gameId, userId) => {
  if (getGamePlayerFromUser(state, gameId, userId)) {
    const players = Object.assign({}, getGame(state, gameId).players);
    delete players[userId];
    return players;
  }
};
