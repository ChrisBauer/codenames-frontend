/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './Lobby.scss';

export default class LobbyLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lobby: PropTypes.object.isRequired,
  };

  render() {
    console.log(this.props);
    const { lobby: { users, games }, actions } = this.props;

    const newGameHandler = () => {
      actions.createGame({id: 1, username: 'chris'});
    };

    return (
      <div className="lobby">
        <Link to="/">Back to Home</Link>
        <div className="users">
          <h1>Users</h1>
          <hr />
          {users.map(user => (
            <div className="user">{user.displayName}</div>
          ))}
        </div>
        <div className="games">
          <h1>Games</h1>
          <hr />
          <button onClick={newGameHandler}>Create Game</button>
          {games.map(game => (
            <div key={game.id} className="game">{game.name}</div>
          ))}
        </div>
      </div>
    );
  }
}
