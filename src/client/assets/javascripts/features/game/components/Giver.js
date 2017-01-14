/**
 * Created by chris on 1/12/17.
 */

import React, { Component, PropTypes } from 'react';
import {Player} from 'models/user';
import {ACTION_TYPES} from 'actions/gameplayActions';

import './Game.scss';

export default class Giver extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    gameplay: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  giveClue (person) {
    if (!this.clue.value || this.clue.value.indexOf(' ') != -1) {
      return 'Invalid clue';
    }
    if (this.count.value == '' || this.count.value == null) {
      return 'Invalid count';
    }
    this.props.actions.giveClue(person.id, this.clue.value, this.count.value);
  }

  getCluegiverContent(person, gameplay) {
    if (gameplay.nextMove == person.player.team && gameplay.nextMoveType == ACTION_TYPES.GIVE_CLUE) {
      return (
        <div className="clue-form">
          <input ref={input => {this.clue = input; }} placeholder="Clue" />
          <input ref={input => {this.count = input; }} type="number" value="1" />
          <button onClick={() => this.giveClue(person)}>Give Clue</button>
        </div>
      );
    }
    return (
      <div className="no-action"></div>
    )
  }

  render () {
    const {person, gameplay} = this.props;
    return this.getCluegiverContent(person, gameplay);
  }
}
