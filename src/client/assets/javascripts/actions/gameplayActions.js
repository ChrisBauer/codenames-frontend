/**
 * Created by chris on 1/9/17.
 */

import {wordList, CardState, CardColor} from 'models/card';

import {getCurrentGameId, getGame} from 'utils/stateTraversal';
import {gameCanStart} from 'utils/validators';

export const INIT_GAMEPLAY = 'codenames/actions/gameplay/initGameplay';
export const GUESS = 'codenames/actions/gameplay/guess';
export const PASS = 'codenames/actions/gameplay/pass';
export const GIVE_CLUE = 'codenames/actions/gameplay/giveClue';
export const SUGGEST_TO_TEAM = 'codenames/actions/gameplay/suggestToTeam';
import horizonRedux from 'app/horizon/redux';

export const ACTION_TYPES = {
  GUESS: 'Guess',
  GIVE_CLUE: 'Give Clue',
  PASS: 'Pass'
};

horizonRedux.takeLatest(
  INIT_GAMEPLAY,
  (horizon, action, getState) => {
    const state = getState();
    const currentGameId = getCurrentGameId(state);
    if (currentGameId != action.gameId) {
      return;
    }

    const game = getGame(state, action.gameId);
    if (!gameCanStart(game.players)) {
      return;
    }

    game.play = getInitialState();
    game.status = 'IN_PROGRESS';

    return horizon('games').replace(game);
  },
  (result, action, dispatch) => {},
  err => console.err('error initializing gameplay', err)
);

export const delegate = (state, action) => {
  if (!state) {
    return getInitialState();
  }
  const gameId = state.currentGameId;
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

const generateBoard = (firstTeam = 'RED') => {

  const getNextWord = (alreadyUsed, wordList) => {
    let nextIndex = Math.random() * wordList.length | 0;
    while(alreadyUsed.indexOf(nextIndex) != -1) {
      nextIndex++;
    }
    alreadyUsed.push(nextIndex);
    return wordList[nextIndex];
  };

  const board = [];
  const alreadyUsed = [];
  let i;
  for (i = 0; i < 25; i++) {
    const nextWord = getNextWord(alreadyUsed, wordList);
    const newCard = {word: nextWord, state: CardState.FRESH, key: alreadyUsed[alreadyUsed.length - 1]};
    if (i < 8) {
      newCard.color = 'RED';
    }
    else if (i < 16) {
      newCard.color = 'BLUE';
    }
    else if (i < 23) {
      newCard.color = 'BROWN';
    }
    else if (i == 23) {
      newCard.color = 'BLACK';
    }
    else {
      newCard.color = firstTeam;
    }
    board.push(newCard);
  }
  for (i = 0; i < board.length; i++) {
    const swapIndex = Math.random() * board.length | 0;
    const swapCard = board[swapIndex];
    board[swapIndex] = board[i];
    board[i] = swapCard;
  }
  return board;
};

const getInitialState = () => {
  const board = generateBoard();
  const redFirst = board.filter(card => card.color == 'RED').length == 9;
  return {
    board: board,
    nextMove: redFirst ? 'RED' : 'BLUE',
    nextMoveType: ACTION_TYPES.GIVE_CLUE,
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
      if (state.nextMoveType != ACTION_TYPES.GUESS || player.team != state.nextMove) {
        return state;
      }
      move = {player, action: ACTION_TYPES.PASS};
      return {
        ...state,
        play: {
          ...state.play,
          moves: [...state.play.moves, move],
          nextMove: getOtherTeam(player.team),
          nextMoveType: ACTION_TYPES.GIVE_CLUE
        }
      };
    case GUESS:
      // Make sure it's a valid time to guess
      if (state.nextMoveType != ACTION_TYPES.GUESS || player.team != state.nextMove) {
        return state;
      }
      // If it's already been guessed, ignore it.
      if (state.board[action.cardIndex].status == 'GUESSED') {
        return state;
      }
      move = {player, action: ACTION_TYPES.GUESS, card: state.board[action.cardIndex]};
      const card = Object.assign({}, state.board[action.cardIndex]);
      card.revealed = true;
      if (card.color == 'BLACK') {
        // Assassin card
        return {
          ...state,
          status: 'COMPLETE',
          play: {
            ...state.play,
            board: [
              ...state.board.slice(0, action.cardIndex),
              card,
              ...state.board.slice(action.cardIndex + 1)
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
              ...state.board.slice(0, action.cardIndex),
              card,
              ...state.board.slice(action.cardIndex + 1)
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
              ...state.board.slice(0, action.cardIndex),
              card,
              ...state.board.slice(action.cardIndex + 1)
            ],
            moves: [...state.play.moves, move],
            nextMoveType: ACTION_TYPES.GIVE_CLUE,
            clue: '',
            nextTurn: getOtherTeam(player.team)
          }
        }
      }

    case GIVE_CLUE:
      if (state.play.nextMoveType != ACTION_TYPES.GIVE_CLUE || player.team != state.play.nextMove) {
        return state;
      }
      return {
        ...state,
        play: {
          ...state.play,
          guessesRemaining: action.count,
          clue: action.clue,
          moves: [...state.play.moves, {action: ACTION_TYPES.GIVE_CLUE, clue: action.clue, count: action.count}],
          nextMoveType: ACTION_TYPES.GUESS
        }
      };


    case SUGGEST_TO_TEAM:
      // TODO: Implement?
      return state;

    default:
      return state;
  }
};

export const initGameplay = (gameId) => ({
  type: INIT_GAMEPLAY,
  gameId
});

export const pass = (userId) => ({
  type: PASS,
  userId
});

export const guess = (userId, card) => ({
  type: GUESS,
  userId,
  card
});

export const giveClue = (userId, clue, count) => ({
  type: GIVE_CLUE,
  userId,
  clue,
  count
});

export const gameplayActions = {
  initGameplay,
  pass,
  guess,
  giveClue
};
