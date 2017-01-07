/**
 * Created by chris on 1/4/17.
 */
// @flow

import { createStructuredSelector } from 'reselect';

import { GameState } from 'models/states';
import { Player, Team } from 'models/user';
import { GameInfo, Game } from 'models/game';
import { Card } from 'models/card';

// Action Types

const TAKE_TURN = 'codenames/game/TAKE_TURN';
const TURN_RESULT = 'codenames/game/TURN_RESULT';
const POPULATE_GAME = 'codenames/game/POPULATE_GAME';

// This will be used in our root reducer and selectors

export const NAME = 'game';

// Define the initial state for `game` module

const initialState: GameState = {
  info: {},
  players: [],
  nextTurn: '',
  moves: []
};
// Reducer

/**
 * Another clever approach of writing reducers:
 *
 * export default function(state = initialState, action) {
 *   const actions = {
 *      [ACTION_TYPE]: () => [action.payload.data, ...state]
 *   };
 *
 *   return (_.isFunction(actions[action.type])) ? actions[action.type]() : state
 * }
 */

export default function reducer(state: GameState = initialState, action: any = {}): GameState {
  switch (action.type) {
    case POPULATE_GAME: {
      return {
        info: action.gameInfo,
        players: action.players,
        nextTurn: action.nextTurn,
        moves: []
      };
    }

    case TAKE_TURN:
      return {
        ...state,
        moves: [...state.moves, action.turn]
      };

    case TURN_RESULT:
      return {
        ...state
      };

    default:
      return state;
  }
}

// Action Creators

const populateGame = (gameInfo: GameInfo, players: [Player], nextTurn: Team) => ({
  type: POPULATE_GAME,
  gameInfo,
  players,
  nextTurn
});

const takeTurn = (player: Player, card: Card) => ({
  type: TAKE_TURN,
  player,
  card
});

const turnResult = () => ({
  type: TURN_RESULT
});

export const selector = createStructuredSelector({
  game: state => state['game'],
  login: state => state['login']
});

export const actionCreators = {
  populateGame,
  takeTurn,
  turnResult
};
