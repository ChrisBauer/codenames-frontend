/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as stagingActions, selector } from '../';
import { actionCreators as loginActions } from '../../login';
import { actionCreators as lobbyActions } from '../../lobby';
import StagingLayout from './StagingLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...loginActions, ...stagingActions, ...lobbyActions}, dispatch)
}))
export default class StagingView extends Component {
  render() {
    return (
      <div>
        <StagingLayout {...this.props} />
      </div>
    );
  }
}
