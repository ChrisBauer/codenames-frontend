// @flow
/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import PlayerCard from './PlayerCard';

import './Staging.scss';

export default class StagingLayout extends Component {
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
    }, {red: {}, blue: {}});
  }

  validateProps (props) {
    const { users: { currentUserId, users}, games: { games, currentGameId }, actions } = props;
    if (currentUserId == null) {
      this.context.router.push('/');
      return false;
    }
    if (currentGameId == null) {
      this.context.router.push('/lobby');
      return false;
    }

    const thisPerson = this.getPerson(users, games[currentGameId].players, currentUserId);
    if (!thisPerson) {
      this.context.router.push('/lobby');
      return false;
    }

    const game = games[currentGameId];
    if (game.status == 'IN_PROGRESS' && game.players[thisPerson.id]) {
      this.context.router.push('/game');
      return false;
    }
    return true;
  }

  render() {
    if (!this.validateProps(this.props)) {
      return null;
    }
    const { users: { currentUserId, users}, games: { games, currentGameId }, actions } = this.props;

    const game = games[currentGameId];
    const teams = this.getTeams(users, game.players);

    const logout = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const leaveStaging = () => {
      actions.leaveCurrentGame();
      this.context.router.push('/lobby');
    };

    // TODO: make person component, switcher component to avoid duplication

    return (
      <div>
        <div className="top-bar">
          <a onClick={leaveStaging}>Back to Lobby</a>
          <a onClick={logout}>Logout</a>
        </div>
        <div className="staging">
          <div className="red">
            <h1>Red Team</h1>
            <hr />
            {Object.keys(teams.red).map(userId => {
              const person = teams.red[userId];
              return <PlayerCard key={userId} actions={actions} person={person} currentUserId={currentUserId}/>;
            })}
          </div>
          <div className="blue">
            <h1>Blue Team</h1>
            <hr />
            {Object.keys(teams.blue).map(userId => {
              const person = teams.blue[userId];
              return <PlayerCard key={userId} actions={actions} person={person} currentUserId={currentUserId}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
