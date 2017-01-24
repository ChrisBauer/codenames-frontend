/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';

import './Login.scss';
import { validateUser } from 'utils/validators';

export default class LoginLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    users: PropTypes.object,
    currentUserId: PropTypes.string
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {
    console.log(this.props);
    console.log('in render function');
    const { users, currentUserId, actions } = this.props;

    if (currentUserId && validateUser(users, currentUserId)) {
      this.context.router.push('/lobby');
    }

    const loginHandler = () => {
      if (this.loginInput.value) {
        actions.loginUser(this.loginInput.value);
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
