/**
 * Created by chris on 1/4/17.
 */

import React, { Component, PropTypes } from 'react';

import './Login.scss';
import { validateUser, isAdminUser} from 'utils/validators';

export default class LoginLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    users: PropTypes.object,
    currentUserId: PropTypes.string
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  validateProps(props) {
    const { users, currentUserId } = this.props;

    if (currentUserId && validateUser(users, currentUserId)) {
      if (isAdminUser(users, currentUserId)) {
        this.context.router.push('/admin');
        return false;
      }
      this.context.router.push('/lobby');
      return false;
    }
    return true;
  }

  render() {
    if (!this.validateProps(this.props)) {
      return null;
    }
    document.title = 'Codenames';
    const { actions } = this.props;
    const loginHandler = () => {
      if (this.loginInput.value) {
        actions.loginUser(this.loginInput.value);
      }
    };

    return (
      <div className="login">
        <div className="splash">
          Welcome to Codenames!
        </div>
        <div>
          <input ref={input => {this.loginInput = input; }} placeholder="Username"></input>
          <button onClick={loginHandler}>Login</button>
        </div>
      </div>
    );
  }
}
