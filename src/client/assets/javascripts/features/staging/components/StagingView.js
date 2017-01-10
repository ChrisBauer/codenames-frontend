/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selector } from '../';
import { gameActions } from 'actions/gameActions';
import { userActions } from 'actions/userActions';
import { playerActions } from 'actions/playerActions';
import StagingLayout from './StagingLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...gameActions, ...userActions, ...playerActions}, dispatch)
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
