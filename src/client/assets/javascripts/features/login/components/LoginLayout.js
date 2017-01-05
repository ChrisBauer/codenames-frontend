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

  render() {
    console.log(this.props);
    console.log('in render function');
    const { login: { user }, actions } = this.props;


    const loginHandler = () => {
      if (this.loginInput.value) {
        actions.login(this.loginInput.value);
      }
    };

    const logoutHandler = () => {
      actions.removeUsers([user]);
      actions.logout()
    };

    const goToLobby = () => {
      actions.addUsers([user]);
      this.props.history.push('/lobby');
    };

    const generateTemplate = () => {
      if (user) {
        return (
          <div>
            <h1>Hello {user.username}</h1>
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
