/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';

import './Lobby.scss';

export default class LobbyLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lobby: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
  };

  render() {
    console.log(this.props);
    const { lobby: { users, games }, login: {user}, actions } = this.props;

    if (!user) {
      this.props.history.push('/login');
    }

    const newGameHandler = () => {
      actions.createGame({id: 1, username: 'chris'});
    };

    const leaveLobby = () => {
      console.log(user);
      console.log(this.props);
      // TODO: figure out how to get the current user and log him out
      actions.removeUsers([user]);
      actions.logout(user);
      this.props.history.push('/login');
    };

    const goToGame = (gameId) => {
      console.log(gameId);
      this.props.history.push('/staging/' + gameId);
    };

    return (
      <div className="lobby">
        <a onClick={leaveLobby}>Back to Login</a>
        <div className="users">
          <h1>Users</h1>
          <hr />
          {users.map(user => (
            <div key={user.id} className="user">{user.username}</div>
          ))}
        </div>
        <div className="games">
          <h1>Games</h1>
          <hr />
          <button onClick={newGameHandler}>Create Game</button>
          {games.map(game => (
            <div key={game.id} className="game" onClick={() => goToGame(game.id)}>{game.name}</div>
          ))}
        </div>
      </div>
    );
  }
}
