/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { createNewGame } from '../lobby';
import { validateUser } from '../../../validators';

import './Lobby.scss';

export default class LobbyLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    lobby: PropTypes.object.isRequired
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

    const newGameHandler = (user: User, name: string) => {
      const game = createNewGame(user, name);
      actions.addGames([game]);
      actions.populateStaging(game);
      this.context.router.push('/staging/0');
    };

    const leaveLobby = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const goToGame = (gameId) => {
      actions.populateStaging(games.find(game => game.id == gameId));
      this.context.router.push('/staging/' + gameId);
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
          <button onClick={() => newGameHandler(user, 'Testing')}>Create Game</button>
          {Object.keys(games).map(id => (
            <div key={id} className="game" onClick={() => goToGame(id)}>{games[id].name}</div>
          ))}
        </div>
      </div>
    );
  }
}
