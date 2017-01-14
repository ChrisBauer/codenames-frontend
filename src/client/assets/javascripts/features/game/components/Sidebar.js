/**
 * Created by chris on 1/14/17.
 */

import React, { Component, PropTypes } from 'react';
import {Player} from 'models/user';
import {ACTION_TYPES} from 'actions/gameplayActions';
import Giver from './Giver';
import Guesser from './Guesser';

import './Game.scss';

export default class Sidebar extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    gameplay: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  renderGiver(person,gameplay,actions) {
    return (
      <Giver person={person} gameplay={gameplay} actions={actions} />
    );
  }

  renderGuesser(person,gameplay,actions) {
    return (
      <Guesser person={person} gameplay={gameplay} actions={actions}/>
    );
  }


  render() {
    const { person, gameplay, actions } = this.props;
    let gameActions;
    if (person.player.role == 'GIVER') {
      gameActions = this.renderGiver(person, gameplay, actions);
    }
    if (person.player.role == 'GUESSER') {
      gameActions = this.renderGuesser(person, gameplay, actions);
    }

    return (
      <div className="sidebar">
        <p><span className="move">{gameplay.nextMove}</span> team: <span className="type">{gameplay.nextMoveType}</span></p>
        {gameActions}
      </div>
    );
  }
}