/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selector } from '../';
import { userActions } from 'actions/userActions';
import LoginLayout from './LoginLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...userActions}, dispatch)
}))
export default class LoginView extends Component {
  render() {
    return (
      <div>
        <LoginLayout {...this.props} />
      </div>
    );
  }
}
