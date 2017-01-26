/**
 * Created by chris on 1/14/17.
 */

import React, { Component, PropTypes } from 'react';
import {ACTION_TYPES} from 'actions/gameplayActions';

import './Game.scss';

export default class Guesser extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    gameplay: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  pass (person) {
    this.props.actions.pass(person.id);
  }

  getGuesserContent(person, gameplay) {
    if (gameplay.nextMove == person.player.team && gameplay.nextMoveType == ACTION_TYPES.GUESS) {
      return (
        <div className="clue-form">
          <p>You're up!</p>
          <button onClick={() => this.pass(person)}>Pass</button>
        </div>
      );
    }
    return (
      <div className="no-action"></div>
    )
  }

  render () {
    const {person, gameplay} = this.props;
    return this.getGuesserContent(person, gameplay);
  }
}
