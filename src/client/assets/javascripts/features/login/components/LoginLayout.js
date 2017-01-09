/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';

import './Login.scss';

export default class LoginLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    console.log(this.props);
    console.log('in render function');
    const { currentUserId, users, actions } = this.props;


    const loginHandler = () => {
      if (this.loginInput.value) {
        actions.createUser(this.loginInput.value);
        this.context.router.push('/lobby');
      }
    };

    const logoutHandler = () => {
      actions.logout();
    };

    const goToLobby = () => {
      this.props.history.push('/lobby');
    };

    const generateTemplate = () => {
      if (currentUserId) {
        return (
          <div>
            <h1>Hello {users[currentUserId].username}</h1>
            <a onClick={goToLobby}>Go to Lobby</a>
            <hr />
            <a onClick={logoutHandler}>Logout</a>
          </div>
        );
      }
      return (
        <div>
          <input ref={input => {this.loginInput = input; }} placeholder="Username"></input>
          <button onClick={loginHandler}>Login</button>
        </div>
      );
    };

    return (
      <div className="login">
        {generateTemplate()}
      </div>
    );
  }
}
