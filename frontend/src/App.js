import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorCatcher from './components/AlertWindow';

import Home from './components/Home';
import Auth from './components/Auth';
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <ErrorCatcher>
      <UserProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
          </Switch>
        </Router>
      </UserProvider>
    </ErrorCatcher>
  );
};

export default App;
