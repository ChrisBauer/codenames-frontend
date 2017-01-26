// @flow
/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import {Player} from 'models/user';

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
    }, {RED: {}, BLUE: {}});
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
    const thisPerson = this.getPerson(users, game.players, currentUserId);
    const teams = this.getTeams(users, game.players);

    const logout = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const leaveStaging = () => {
      actions.leaveCurrentGame();
      this.context.router.push('/lobby');
    };

    const changeTeam = () => {
      actions.changeTeam(currentUserId);
    };

    const changeRole = () => {
      actions.changeRole(currentUserId);
    };

    const setReady = () => {
      actions.setReady(currentUserId);
    };

    // TODO: make person component, switcher component to avoid duplication

    return (
      <div className="staging">
        <a onClick={logout}>Logout</a>
        <a onClick={leaveStaging}>Back to Lobby</a>
        <div className="red">
          <h1>Red Team</h1>
          <hr />
          {Object.keys(teams.RED).map(userId => {
            const person = teams.RED[userId];
            if (person.id == thisPerson.id) {
              return (
                <div key={userId} className="player">
                  <div className={person.player.ready ? 'is-ready': ''}/>
                  <h2 className={person.player.role}>{person.user.username}</h2>
                  <button className="change-team" onClick={changeTeam}>T</button>
                  <button className="change-role" onClick={changeRole}>R</button>
                  <button className="set-ready" onClick={setReady}>✓</button>
                </div>
              )
            }
            return (
              <div key={userId} className="player">
                <div className={person.player.ready ? 'is-ready': ''}/>
                <h2 className={person.player.role}>{person.user.username}</h2>
              </div>
            )
          })}
        </div>
        <div className="blue">
          <h1>Blue Team</h1>
          <hr />
          {Object.keys(teams.BLUE).map(userId => {
            const person = teams.BLUE[userId];
            if (person.id == thisPerson.id) {
              return (
                <div key={userId} className="player">
                  <div className={person.player.ready ? 'is-ready': ''}/>
                  <h2 className={person.player.role}>{person.user.username}</h2>
                  <button className="change-team" onClick={changeTeam}>T</button>
                  <button className="change-role" onClick={changeRole}>R</button>
                  <button className="set-ready" onClick={setReady}>✓</button>
                </div>
              )
            }
            return (
              <div key={userId} className="player">
                <div className={person.player.ready ? 'is-ready': ''}/>
                <h2 className={person.player.role}>{person.user.username}</h2>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
