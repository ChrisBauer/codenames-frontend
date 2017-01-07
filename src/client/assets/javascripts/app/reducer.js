import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import friends, { NAME as friendsName } from 'features/friends';
import login, {NAME as loginName} from 'features/login';
import lobby, {NAME as lobbyName} from 'features/lobby';
import staging, {NAME as stagingName} from 'features/staging';
import game, {NAME as gameName} from 'features/game';

export default combineReducers({
  routing,
  [friendsName]: friends,
  [loginName]: login,
  [lobbyName]: lobby,
  [stagingName]: staging,
  [gameName]: game
});
