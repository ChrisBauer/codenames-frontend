/**
 * Created by chris on 1/9/17.
 */

export const CHANGE_TEAM = 'codenames/actions/players/changeTeam';
export const CHANGE_ROLE = 'codenames/actions/players/changeRole';
export const SET_READY = 'codenames/actions/players/setReady';

const resetReady = (players) => {
  Object.keys(players).forEach(id => players[id].ready = false);
};

export const reducer = (state = {}, action) => {
  const originalState = Object.assign({}, state);
  const stateCopy = Object.assign({}, state);
  resetReady(stateCopy);
  switch (action.type) {
    case CHANGE_TEAM:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          team: stateCopy[action.userId].team == 'RED' ? 'BLUE' : 'RED'
        }
      };
    case CHANGE_ROLE:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          role: stateCopy[action.userId].role == 'GUESSER' ? 'GIVER' : 'GUESSER'
        }
      };
    case SET_READY:
      return {
        ...stateCopy,
        [action.userId]: {
          ...stateCopy[action.userId],
          ready: true
        }
      };
    default:
      return originalState;
  }
};

export const changeTeam = (userId) => ({
  type: CHANGE_TEAM,
  userId
});

export const changeRole = (userId) => ({
  type: CHANGE_ROLE,
  userId
});

export const setReady = (userId) => ({
  type: SET_READY,
  userId
});

export const playerActions = {
  changeTeam,
  changeRole,
  setReady
};
