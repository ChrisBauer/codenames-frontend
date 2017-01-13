/**
 * Created by chris on 1/4/17.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selector } from '../';
import { gameActions } from 'actions/gameActions';
import { gameplayActions } from 'actions/gameplayActions';
import { userActions } from 'actions/userActions';
import { playerActions } from 'actions/playerActions';
import GameLayout from './GameLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators({...gameActions, ...userActions, ...gameplayActions, ...playerActions}, dispatch)
}))
export default class GameView extends Component {
  render() {
    return (
      <div>
        <GameLayout {...this.props} />
      </div>
    );
  }
}
