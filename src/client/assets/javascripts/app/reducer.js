import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import friends, { NAME as friendsName } from 'features/friends';
import lobby, {NAME as lobbyName} from 'features/lobby';

export default combineReducers({
  routing,
  [friendsName]: friends,
  [lobbyName]: lobby
});
