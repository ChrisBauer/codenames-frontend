import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import NotFoundView from 'components/NotFound';
import LoginView from 'features/login/components/LoginView';
import LobbyView from 'features/lobby/components/LobbyView';
import StagingView from 'features/staging/components/StagingView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginView} />
    <Route path="404" component={NotFoundView} />
    <Route path="lobby" component={LobbyView} />
    <Route path="staging/:gameId" component={StagingView} />
    <Redirect from="*" to="404" />
  </Route>
);
