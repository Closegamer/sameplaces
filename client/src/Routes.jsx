import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./containers/Home'));
const About = lazy(() => import('./containers/About'));
const Admin = lazy(() => import('./containers/Admin'));

function Routes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/playground' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/admin' component={Admin} />
      </Switch>
    </Suspense>
  );
}

export default Routes;
