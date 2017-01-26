/**
 * Created by chris on 1/9/17.
 */

import {wordList, CardState, CardColor} from 'models/card';
import {Observable} from 'rxjs';

import {getCurrentUserId, getUser, getCurrentGameId, getGame, getGamePlayerFromUser} from 'utils/stateTraversal';
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
      return Observable.empty();
    }

    const game = getGame(state, action.gameId);
    if (!gameCanStart(game.players)) {
      return Observable.empty();
    }

    game.play = getInitialState();
    game.status = 'IN_PROGRESS';

    return horizon('games').replace(game);
  },
  (result, action, dispatch) => {},
  err => console.err('error initializing gameplay', err)
);

horizonRedux.takeLatest(
  PASS,
  (horizon, action, getState) => {
    const state = getState();
    const gameId = getCurrentGameId(state);
    const userId = getCurrentUserId(state);
    const game = getGame(state, gameId);
    const player = getGamePlayerFromUser(state, gameId, userId);
    if (!gameId || !userId || !game || !player) {
      return Observable.empty();
    }
    const gameplay = game.play;
    if (gameplay.nextMoveType != ACTION_TYPES.GUESS || player.team != gameplay.nextMove || player.role != 'GUESSER') {
      return Observable.empty();
    }
    const move = {userId, action: ACTION_TYPES.PASS};
    const newGameplay = {
      nextMove: getOtherTeam(player.team),
      nextMoveType: ACTION_TYPES.GIVE_CLUE,
      moves: [...gameplay.moves, move]
    };
    return horizon('games').update({id: gameId, play: newGameplay});
  },
  (result, action, dispatch) => {},
  err => console.err('error attempting to pass', err)
);

horizonRedux.takeLatest(
  GUESS,
  (horizon, action, getState) => {
    const state = getState();
    const gameId = getCurrentGameId(state);
    const userId = getCurrentUserId(state);
    const game = getGame(state, gameId);
    const player = getGamePlayerFromUser(state, gameId, userId);
    if (!gameId || !userId || !game || !player) {
      return Observable.empty();
    }

    const gameplay = game.play;
    // Make sure it's a valid time to guess
    if (gameplay.nextMoveType != ACTION_TYPES.GUESS || player.team != gameplay.nextMove || player.role != 'GUESSER') {
      return Observable.empty();
    }
    // If it's already been guessed, ignore it.
    if (action.card.status == 'GUESSED') {
      return Observable.empty();
    }

    action.card.status = 'GUESSED';

    const move = {userId, action: ACTION_TYPES.GUESS, card: action.card};

    if (action.card.color == 'BLACK') {
      // Assassin card
      const newGameplay = {
        guessesRemaining: 0,
        clue: '',
        nextMove: null,
        nextMoveType: null,
        board: gameplay.board,
        moves: [...gameplay.moves, move],
        victor: getOtherTeam(player.team)
      };
      return horizon('games').update({id: gameId, status: 'COMPLETE', play: newGameplay});
    }
    else if (action.card.color == player.team && gameplay.guessesRemaining != 1) {
      const newGameplay = {
        guessesRemaining: gameplay.guessesRemaining - 1,
        board: gameplay.board,
        moves: [...gameplay.moves, move]
      };
      return horizon('games').update({id: gameId, play: newGameplay});
    }
    // If they guessed incorrectly, or they're out of guesses, it passes to the other team.
    else {
      const newGameplay = {
        guessesRemaining: 0,
        nextMoveType: ACTION_TYPES.GIVE_CLUE,
        nextMove: getOtherTeam(player.team),
        clue: '',
        board: gameplay.board,
        moves: [...gameplay.moves, move]
      };
      return horizon('games').update({id: gameId, play: newGameplay});
    }
  },
  (result, action, dispatch) => {
    // TODO: check victory condition!
  },
  err => console.err('error making guess', err)
);

horizonRedux.takeLatest(
  GIVE_CLUE,
  (horizon, action, getState) => {
    const state = getState();
    const gameId = getCurrentGameId(state);
    const userId = getCurrentUserId(state);
    const game = getGame(state, gameId);
    const player = getGamePlayerFromUser(state, gameId, userId);
    if (!gameId || !userId || !game || !player) {
      return Observable.empty();
    }

    const gameplay = game.play;

    if (gameplay.nextMoveType != ACTION_TYPES.GIVE_CLUE || player.team != gameplay.nextMove || player.role != 'GIVER') {
      return Observable.empty();
    }

    const move = {
      userId,
      action: ACTION_TYPES.GIVE_CLUE,
      clue: action.clue,
      count: action.count
    };
    const newGameplay = {
      guessesRemaining: action.count != 0 ? action.count + 1 : -1,
      clue: action.clue,
      moves: [...gameplay.moves, move],
      nextMoveType: ACTION_TYPES.GUESS
    };
    return horizon('games').update({id: gameId, play: newGameplay});
  },
  (result, action, dispatch) => {},
  err => console.err('error giving clue', err)
);

const getOtherTeam = team => team == 'RED' ? 'BLUE' : 'RED';

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
    const newCard = {word: nextWord, status: CardState.FRESH, key: alreadyUsed[alreadyUsed.length - 1]};
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
