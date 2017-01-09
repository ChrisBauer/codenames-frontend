/**
 * Created by chris on 1/7/17.
 */

const CREATE_GAME = 'codenames/actions/game/createGame';
const ADD_GAMES = 'codenames/actions/game/addGames';

let nextGameId = 0;

const createNewGame = (name) => {
  return {
    id: nextGameId++,
    name: name
  }
};

const initialState = {
  currentGameId: null,
  games: {}
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      const game = createNewGame(action.game);
      return {
        currentUserId: game.id,
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

    default:
      return state;
  }
};

export const createGame = (game) => ({
  type: CREATE_GAME,
  game
});

export const gameActions = {
  createGame
};
