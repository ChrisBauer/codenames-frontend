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

  getTeams (users, players) {
    return Object.keys(players).reduce((teams, userId) => {
      const nextPerson = this.getPerson(users, players, userId);
      const team = nextPerson.player.team;
      teams[team][userId] = nextPerson;
      return teams;
    }, {RED: {}, BLUE: {}});
  }

  verifyState(users, games, currentUserId, currentGameId) {
    if (currentUserId == null) {
      this.context.router.push('/');
    }
    if (currentGameId == null) {
      this.context.router.push('/lobby');
    }

    const thisPerson = this.getPerson(users, games[currentGameId].players, currentUserId);
    if (!thisPerson) {
      this.context.router.push('/lobby');
    }

    const game = games[currentGameId];

    if (game.status == 'PENDING') {
      this.context.router.push('/staging');
    }

    const gameplay = game.play;

    const teams = this.getTeams(users, game.players);

    return {game, thisPerson, teams, gameplay};
  }

  validateAction (thisPerson, gameplay, actionType) {
    if (gameplay.nextMove == thisPerson.player.team) {
      if (gameplay.nextMoveType == ACTION_TYPES.GIVE_CLUE && thisPerson.player.role == 'GIVER') {
        return this.props.actions.giveClue;
      }
      if (gameplay.nextMoveType == ACTION_TYPES.GUESS && thisPerson.player.role == 'GUESSER') {
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
    const { users: { currentUserId, users}, games: { games, currentGameId }, actions } = this.props;

    const { thisPerson, gameplay } = this.verifyState(users, games, currentUserId, currentGameId);

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
        <a onClick={this.logout}>Logout</a>
        <a onClick={this.leaveGame}>Leave Game</a>
        <div className="game">
          <div className="board">
            {gameplay.board.map(card => {
              let classes = 'card';
              if (card.status == 'GUESSED') {
                classes += ` ${card.color}`;
              }
              return (
                <div key={card.id} className={classes} onClick={() => cardAction(card)}>{card.word}</div>
              );
            })}
          </div>
          <Sidebar person={thisPerson} gameplay={gameplay} actions={actions} />
        </div>
      </div>
    );
  }
}
