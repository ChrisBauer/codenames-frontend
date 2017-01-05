import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import FriendsView from 'features/friends/components/FriendsView';
import NotFoundView from 'components/NotFound';
import LobbyView from 'features/lobby/components/LobbyView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={FriendsView} />
    <Route path="404" component={NotFoundView} />
    <Route path="lobby" component={LobbyView} />
    <Redirect from="*" to="404" />
  </Route>
);
