/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as lobbyActions, selector } from '../';
import { actionCreators as loginActions } from '../../login';
import { actionCreators as stagingActions } from '../../staging';
import LobbyLayout from './LobbyLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...loginActions, ...lobbyActions, ...stagingActions}, dispatch)
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
