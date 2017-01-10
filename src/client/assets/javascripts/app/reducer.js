import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import {reducer as users} from 'actions/userActions';
import {reducer as games} from 'actions/gameActions';

export default combineReducers({
  routing,
  users,
  games
});
