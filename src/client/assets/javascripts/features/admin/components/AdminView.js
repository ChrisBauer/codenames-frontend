/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selector } from '../';
import { userActions } from 'actions/userActions';
import { gameActions } from 'actions/gameActions';
import { adminActions } from 'actions/adminActions';
import AdminLayout from './AdminLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...userActions, ...gameActions, ...adminActions}, dispatch)
}))
export default class AdminView extends Component {
  render() {
    return (
      <div>
        <AdminLayout {...this.props} />
      </div>
    );
  }
}
