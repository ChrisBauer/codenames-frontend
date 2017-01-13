/**
 * Created by chris on 1/9/17.
 */

export const GUESS = 'codenames/actions/gameplay/guess';
export const PASS = 'codenames/actions/gameplay/pass';
export const GIVE_CLUE = 'codenames/actions/gameplay/giveClue';
export const SUGGEST_TO_TEAM = 'codenames/actions/gameplay/suggestToTeam';

export const ACTION_TYPES = {
  GUESS: 'Guess',
  GIVE_CLUE: 'Give Clue',
  PASS: 'Pass'
};

export const delegate = (state, action) => {
  gameId = state.currentGameId;
  if (gameId == null) {
    return state;
  }

  const gameAfterUpdate = reducer(state.games[gameId], action);

  return {
    ...state,
    games: {
      ...state.games,
      [gameId]: gameAfterUpdate
    }
  };
};

const getOtherTeam = (team) => {
  return team == 'RED' ? 'BLUE' : 'RED';
};

const getInitialState = () => {
  const board = generateBoard();
  const redFirst = board.filter(card => card.color == 'RED').length == 9;
  return {
    board: [],
    nextMove: redFirst ? 'RED' : 'BLUE',
    nextMoveType: 'GIVE_CLUE',
    guessesRemaining: 0,
    clue: '',
    moves: []
  }
};

const getPlayerFromUserId = (game, userId) => game.players[userId];

export const reducer = (state = getInitialState(), action) => {
  const player = getPlayerFromUserId(state, action.userId);
  let move;
  switch(action.type) {
    case PASS:
      // Make sure it's a valid time to pass
      if (state.nextMoveType != 'GUESS' || player.team != state.nextMove) {
        return state;
      }
      move = {player, action: 'PASS'};
      return {
        ...state,
        play: {
          ...state.play,
          moves: [...state.play.moves, move],
          nextMove: getOtherTeam(player.team),
          nextMoveType: 'GIVE_CLUE'
        }
      };
    case GUESS:
      // Make sure it's a valid time to guess
      if (state.nextMoveType != 'GUESS' || player.team != state.nextMove) {
        return state;
      }
      move = {player, action: 'GUESS', card: board[action.cardIndex]};
      const card = Object.assign({}, board[action.cardIndex]);
      card.revealed = true;
      if (card.color == 'BLACK') {
        // Assassin card
        return {
          ...state,
          status: 'COMPLETE',
          play: {
            ...state.play,
            board: [
              ...board.slice(0, cardIndex),
              card,
              ...board.slice(cardIndex + 1)
            ],
            moves: [...state.play.moves, move],
            nextTurn: getOtherTeam(player.team)
          }
        }
      }
      else if (state.play.guessesRemaining > 1) {
        return {
          ...state,
          play: {
            ...state.play,
            guessesRemaining: state.play.guessesRemaining - 1,
            board: [
              ...board.slice(0, cardIndex),
              card,
              ...board.slice(cardIndex + 1)
            ],
            moves: [...state.play.moves, move],
            nextTurn: player.team
          }
        }
      }
      // It wasn't a black card and this team is out of guesses
      else {
        return {
          ...state,
          play: {
            ...state.play,
            guessesRemaining: 0,
            board: [
              ...board.slice(0, cardIndex),
              card,
              ...board.slice(cardIndex + 1)
            ],
            moves: [...state.play.moves, move],
            nextMoveType: 'GIVE_CLUE',
            clue: '',
            nextTurn: getOtherTeam(player.team)
          }
        }
      }

    case GIVE_CLUE:
      if (state.nextMoveType != 'GIVE_CLUE' || player.team != state.nextMove) {
        return state;
      }
      return {
        ...state,
        play: {
          ...state.play,
          guessesRemaining: action.count,
          clue: action.clue,
          moves: [...state.play.moves, {action: 'GIVE_CLUE'}],
          nextMoveType: 'GUESS'
        }
      };


    case SUGGEST_TO_TEAM:
      // TODO: Implement?
      return state;

    default:
      return state;
  }
};

export const pass = (userId) => ({
  type: PASS,
  userId
});

export const guess = (userId, card) => ({
  type: GUESS,
  userId,
  card
});

export const giveClue = (userId, word, count) => ({
  type: GIVE_CLUE,
  userId,
  word,
  count
});
