// @flow
/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import {Player} from 'models/user';
import {ACTION_TYPES} from 'actions/gameplayActions';

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

  getCurrentGame (games, gameId) {
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

  render() {
    console.log(this.props);
    const { users: { currentUserId, users}, games: { games, currentGameId }, actions } = this.props;

    const { game, thisPerson, teams, gameplay } = this.verifyState(users, games, currentUserId, currentGameId);

    const logout = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const leaveGame = () => {
      actions.leaveCurrentGame();
      this.context.router.push('/lobby');
    };

    const cardAction = (card) => {
      const action = this.validateAction(thisPerson, gameplay, ACTION_TYPES.GUESS);
      if (action) {
        action(userId, card);
      }
    };

    const giverSidebar = () => {
      if (thisPerson.player.role == 'GIVER') {
        return <CluegiverSidebar props={...this.props} />;
      }
      return '';
    };

    // TODO: break giver/guesser into separate components?
    // TODO: Or: GamePage, GameBoard, GiverSidebar, GuesserSidebar
    return (
      <div className="game-page">
        <a onClick={logout}>Logout</a>
        <a onClick={leaveGame}>Leave Game</a>
        <div className="game">
          <p><span className="move">{gameplay.nextMove}</span> team: <span className="type">{gameplay.nextMoveType}</span></p>
          <div className="board">
            {gameplay.board.map(card => {
              let classes = 'card';
              if (card.status == 'GUESSED') {
                classes += ` ${card.color}`;
              }
              return (
                <div className={classes} onClick={cardAction(card)}>{card.word}</div>
              );
            })}
          </div>
          {giverSidebar()}
        </div>
      </div>
    );
  }
}
