/**
 * Created by chris on 1/25/17.
 */
import React, { Component, PropTypes } from 'react';

export default class PlayerCard extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    person: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired
  };

  changeTeam (currentUserId) {
    this.props.actions.changeTeam(currentUserId);
  };

  changeRole (currentUserId) {
    this.props.actions.changeRole(currentUserId);
  };

  setReady (currentUserId) {
    this.props.actions.setReady(currentUserId);
  };

  render () {
    const {person, currentUserId} = this.props;

    const getOptions = () => {
      if (person.id == currentUserId) {
        return (
          <ul className="options">
            <li className="change-team" onClick={() => this.changeTeam(currentUserId)}>Change Team</li>
            <li className="change-role" onClick={() => this.changeRole(currentUserId)}>Change Role</li>
            <li className="set-ready" onClick={() => this.setReady(currentUserId)}>Set Ready!</li>
          </ul>
        )
      }
    };
    return (
      <div key={person.id} className="player this-player">
        <div className={person.player.ready ? 'is-ready': ''}/>
        <h2>{person.user.username} &ndash; <span className="role">{person.player.role.toLowerCase()}</span></h2>
        {getOptions()}
      </div>
    )
  }

}
