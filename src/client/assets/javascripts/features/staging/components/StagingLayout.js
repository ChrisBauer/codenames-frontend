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
    lobby: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    staging: PropTypes.object.isRequired
  };

  getPlayerFromUser (players: [Player], user: User): Player {
    return players.find(player => player.user.id == user.id);
  }

  getPlayerObject (players: [Player], readyPlayers: [Player]): Object {
    const playerObj = {
      red: players.filter(player => player.team == 'RED'),
      blue: players.filter(player => player.team == 'BLUE')
    };
    readyPlayers.forEach(ready => {
      playerObj[ready.team.toLowerCase()].find(ready).isReady = true;
    });
    return playerObj;
  }
  render() {
    console.log(this.props);
    const { staging: { gameInfo, readyPlayers}, login: { user }, actions } = this.props;
    if (!user) {
      this.props.history.push('/');
    }

    console.log(user);

    const thisPlayer = this.getPlayerFromUser(gameInfo.players, user);
    if (!thisPlayer) {
      actions.addThisPlayer(user);
    }

    const playerObj = this.getPlayerObject(gameInfo.players, readyPlayers);

    console.log(thisPlayer);
    console.log(playerObj);

    const logout = () => {
      console.log(user);
      actions.logout(user);
      this.props.history.push('/');
    };

    const leaveStaging = () => {
      actions.removePlayersStaging([thisPlayer]);
      this.props.history.push('/lobby');
    };

    const changeTeam = () => {
      actions.changeTeam(thisPlayer, thisPlayer.team == 'RED' ? 'BLUE' : 'RED');
    };

    const changeRole = () => {
      actions.changeRole(thisPlayer, thisPlayer.role == 'GIVER' ? 'GUESSER' : 'GIVER');
    };

    const setReady = () => {
      actions.ready(thisPlayer);
    };


    return (
      <div className="staging">
        <a onClick={logout}>Logout</a>
        <a onClick={leaveStaging}>Back to Lobby</a>
        <div className="red">
          <h1>Red Team</h1>
          <hr />
          {playerObj.red.map(player => (
            <div key={player.user.id} className="player">
              <div className={player.isReady ? 'is-ready': ''} />
              <h2>{player.user.username}</h2>
              <div><button className="change-team" onClick={changeTeam}>T</button></div>
              <div><button className="change-role" onClick={changeRole}>R</button></div>
              <div><button className="set-ready" onClick={setReady}>✓</button></div>
            </div>
          ))}
        </div>
        <div className="blue">
          <h1>Blue Team</h1>
          <hr />
          {playerObj.blue.map(player => (
            <div key={player.user.id} className="player">
              <div className={player.isReady ? 'is-ready': ''} />
              <h2>{player.user.username}</h2>
              <div><button className="change-team" onClick={changeTeam}>T</button></div>
              <div><button className="change-role" onClick={changeRole}>R</button></div>
              <div><button className="set-ready" onClick={setReady}>✓</button></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
