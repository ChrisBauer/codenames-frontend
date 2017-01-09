/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as lobbyActions, selector } from '../';
import { actionCreators as stagingActions } from '../../staging';
import { userActions } from 'actions/userActions';
import { gameActions } from 'actions/gameActions';
import LobbyLayout from './LobbyLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...userActions, ...gameActions, ...lobbyActions, ...stagingActions}, dispatch)
}))
export default class LobbyView extends Component {
  render() {
    return (
      <div>
        <LobbyLayout {...this.props} />
      </div>
    );
  }
}
