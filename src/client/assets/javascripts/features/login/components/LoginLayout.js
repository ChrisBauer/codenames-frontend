/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';

import './Login.scss';

export default class LoginLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    currentUserId: PropTypes.number
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    console.log(this.props);
    console.log('in render function');
    const { currentUserId, actions } = this.props;

    if (currentUserId) {
      this.context.router.push('/lobby');
    }

    const loginHandler = () => {
      if (this.loginInput.value) {
        actions.createUser(this.loginInput.value);
        this.context.router.push('/lobby');
      }
    };

    const generateTemplate = () => {
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
