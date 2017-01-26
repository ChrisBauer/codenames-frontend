/**
 * Created by chris on 1/14/17.
 */

import React, { Component, PropTypes } from 'react';
import {findLast} from 'utils/utils';
import {Roles} from 'models/game';
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
    if (person.player.role == Roles.GIVER) {
      gameActions = this.renderGiver(person, gameplay, actions);
    }
    if (person.player.role == Roles.GUESSER) {
      gameActions = this.renderGuesser(person, gameplay, actions);
    }
    const lastClue = gameplay.nextMoveType == ACTION_TYPES.GIVE_CLUE ? undefined : (
        <div>
          <p>Last Clue: {gameplay.clue}</p>
          <p>Guesses remaining: {(gameplay.guessesRemaining < 0 ? 'Unlimited!' : gameplay.guessesRemaining)}</p>
        </div>
      );

    const getMoveText = moveType => {
      console.log(moveType);
      return moveType == ACTION_TYPES.GUESS ? ' guess' : ' give a clue';
    };

    return (
      <div className="sidebar">
        <p className={gameplay.nextMove}>It's
          <span className="team"> {gameplay.nextMove.toLowerCase()}</span> Team's turn to
          <span className="type">{getMoveText(gameplay.nextMoveType)}</span></p>
        {lastClue}
        {gameActions}
      </div>
    );
  }
}
