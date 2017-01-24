/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { validateUser } from 'utils/validators';

import './Lobby.scss';

export default class LobbyLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    games: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    console.log(this.props);
    const { users: { users, currentUserId }, games: {games}, actions } = this.props;

    if (!validateUser(users, currentUserId)) {
      this.context.router.push('/');
    }

    const newGameHandler = (userId: number, name: string) => {
      actions.createGame(userId, name);
      this.context.router.push('/staging');
    };

    const leaveLobby = () => {
      actions.logoutCurrentUser(currentUserId);
      this.context.router.push('/');
    };

    const goToGame = (gameId) => {
      actions.selectGame(gameId);
      this.context.router.push('/staging');
    };

    /*
     </div>*/

    return (
      <div className="lobby">
        <a onClick={leaveLobby}>Back to Login</a>
        <div className="users">
          <h1>Users</h1>
          <hr />
          {Object.keys(users).map(id => (
            <div key={id} className="user">{users[id].username}</div>
          ))}
        </div>
        <div className="games">
          <h1>Games</h1>
          <hr />
          <button onClick={() => newGameHandler(currentUserId, 'Testing')}>Create Game</button>
          {Object.keys(games).map(id => (
            <div key={id} className="game" onClick={() => goToGame(id)}>{games[id].name}</div>
          ))}
        </div>
      </div>
    );
  }
}
