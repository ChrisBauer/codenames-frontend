/**
 * Created by chris on 1/9/17.
 */

import {wordList, CardState, CardColor} from 'models/card';

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
      // If it's already been guessed, ignore it.
      if (state.board[action.cardIndex].status == 'GUESSED') {
        return state;
      }
      move = {player, action: 'GUESS', card: state.board[action.cardIndex]};
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
