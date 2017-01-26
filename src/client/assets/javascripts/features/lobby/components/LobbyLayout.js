/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { validateUser, validateGameForStaging } from 'utils/validators';

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

  componentWillMount() {
    this.props.actions.watchGames();
  }

  validateProps(props) {
    const { users: { users, currentUserId }, games: {games, currentGameId} } = props;

    if (!validateUser(users, currentUserId)) {
      this.context.router.push('/');
      return false;
    }

    if (validateGameForStaging(games, currentGameId, currentUserId)) {
      this.context.router.push('/staging');
      return false;
    }
    return true;
  }

  render() {
    if (!this.validateProps(this.props)) {
      return null;
    }

    const { users: { users, currentUserId }, games: {games}, actions } = this.props;

    const pendingGames = Object.keys(games).map(id => games[id]).filter(game => game.status == 'PENDING');

    const newGameHandler = (userId: number, name: string) => {
      actions.createGame(userId, name);
    };

    const leaveLobby = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const goToGame = (gameId) => {
      actions.selectGame(gameId);
    };

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
          <ul className="gameList">
            {pendingGames.map(game => (
              <li key={game.id} className="game" onClick={() => goToGame(game.id)}>{game.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
