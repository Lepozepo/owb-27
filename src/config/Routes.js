import React from 'react';
import {
  BrowserRouter as Router,
  // Switch,
  Route,
} from 'react-router-dom';
import * as pages from '~/pages';

export default function Routes() {
  return (
    <Router>
      <Route exact path="/" component={pages.Landing} />
      <Route exact path="/users/:addr/certificates" component={pages.Certificates} />
      <Route exact path="/users/:addr/certificates/:certificateId" component={pages.Certificate} />
    </Router>
  );
}
