// @flow
/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import {Player} from 'models/user';
import {ACTION_TYPES} from 'actions/gameplayActions';
import Sidebar from './sidebar';

import './Game.scss';

export default class GameLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    games: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  getPerson (users, players, userId) {
    return {
      user: users[userId],
      player: players[userId],
      id: userId
    };
  }

  validateProps(props) {
    const { users: { currentUserId, users}, games: { games, currentGameId } } = props;
    if (currentUserId == null) {
      this.context.router.push('/');
      return false;
    }
    if (currentGameId == null) {
      this.context.router.push('/lobby');
      return false;
    }

    const game = games[currentGameId];
    if (game.status != 'IN_PROGRESS' && game.status != 'COMPLETE') {
      this.context.router.push('/lobby');
      return false;
    }

    const thisPerson = this.getPerson(users, game.players, currentUserId);
    if (!thisPerson) {
      this.context.router.push('/lobby');
      return false;
    }
    return true;
  }

  validateAction (thisPerson, gameplay, actionType) {
    if (gameplay.nextMove == thisPerson.player.team) {
      if (actionType == ACTION_TYPES.GIVE_CLUE && gameplay.nextMoveType == ACTION_TYPES.GIVE_CLUE && thisPerson.player.role == 'GIVER') {
        return this.props.actions.giveClue;
      }
      if ((actionType == ACTION_TYPES.GUESS || actionType == ACTION_TYPES.PASS) &&
          gameplay.nextMoveType == ACTION_TYPES.GUESS && thisPerson.player.role == 'GUESSER') {
        if (actionType == ACTION_TYPES.GUESS) {
          return this.props.actions.guess;
        }
        if (actionType == ACTION_TYPES.PASS) {
          return this.props.actions.pass;
        }
      }
    }
    return false;
  }

  logout () {
    this.props.actions.logoutCurrentUser();
    this.context.router.push('/');
  }

  leaveGame () {
    this.props.actions.leaveCurrentGame();
    this.context.router.push('/lobby');
  };

  render() {
    console.log(this.props);

    if (!this.validateProps(this.props)) {
      return null;
    }

    const { users: { currentUserId, users}, games: { games, currentGameId }, actions } = this.props;
    const game = games[currentGameId];
    const gameplay = game.play;
    const thisPerson = this.getPerson(users, game.players, currentUserId);

    const cardAction = (card) => {
      const action = this.validateAction(thisPerson, gameplay, ACTION_TYPES.GUESS);
      if (action) {
        action(currentUserId, card);
      }
    };

    // TODO: break giver/guesser into separate components?
    // TODO: Or: GamePage, GameBoard, GiverSidebar, GuesserSidebar
    return (
      <div className="game-page">
        <a onClick={() => this.logout()}>Logout</a>
        <a onClick={() => this.leaveGame()}>Leave Game</a>
        <div className="game">
          <div className="board">
            {gameplay.board.map(card => {
              let classes = 'card';
              if (card.status == 'GUESSED' || thisPerson.player.role == 'GIVER') {
                classes += ` ${card.color}`;
              }
              if (card.status == 'GUESSED') {
                classes += ' guessed';
              }
              return (
                <div key={card.key} className={classes} onClick={() => cardAction(card)}>{card.word}</div>
              );
            })}
          </div>
          <Sidebar person={thisPerson} gameplay={gameplay} actions={actions} />
        </div>
      </div>
    );
  }
}
