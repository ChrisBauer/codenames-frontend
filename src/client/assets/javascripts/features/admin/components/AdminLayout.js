/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';
import { validateUser, validateGameForStaging, isAdminUser } from 'utils/validators';
import {GameStatus} from 'models/game';

import './Admin.scss';

export default class AdminLayout extends Component {
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
    const { users: { users, currentUserId } } = props;

    if (!currentUserId || !users[currentUserId]) {
      this.context.router.push('/');
      return false;
    }
    if (!isAdminUser(users, currentUserId)) {
      this.context.router.push('/lobby');
      return false;
    }
    return true;
  }


  render() {
    if (!this.validateProps(this.props)) {
      return null;
    }

    const { users: { users, currentUserId }, games: {games}, actions } = this.props;

    if (!games) {
      return null;
    }

    document.title = 'Codenames | Admin';

    const logout = () => {
      actions.logoutCurrentUser();
      this.context.router.push('/');
    };

    const removeUsers = userIds => {
      actions.removeUsers(userIds);
    };

    const removeGames = gameIds => {
      actions.removeGames(gameIds);
    };

    return (
      <div>
        <div className="top-bar">
          <a onClick={logout}>Logout</a>
        </div>
        <div className="admin">
          <div className="users">
            <h1>Users</h1>
            <hr />
            <button onClick={() => removeUsers()}>Remove All Users</button>
            {Object.keys(users).filter(id => id != currentUserId).map(id => (
              <div key={id} className="user" onClick={() => removeUsers([id])}>{users[id].username}</div>
            ))}
          </div>
          <div className="games">
            <h1>Games</h1>
            <hr />
            <div>
              <button onClick={() => removeGames()}>Remove All Games</button>
            </div>
            <ul className="gameList">
              {Object.keys(games).map(gameId => games[gameId]).map(game => (
                <li key={game.id} className="game" onClick={() => removeGames([game.id])}>{game.name}: {game.status}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
