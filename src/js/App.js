import React, { lazy, Suspense, useState } from 'react';
import '../css/app.css';
import NavPage from './NavPage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { 
  Container,
  Spinner
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//lazy imports
const HomePage = lazy( () => import('./HomePage.js'));
const StatusPage = lazy( () => import('./StatusPage.js'));
const AdminPage = lazy( () => import('./AdminPage.js'));
const CreateTagPage = lazy( () => import('./CreateTagPage.js'));

//lazy load spinner
const renderLoader = (
  <Spinner variant="danger" animation="border" role="status">
    <span className="sr-only">
      Loading...
    </span>
  </Spinner>
);


//start main app: mainly routing
function App() {
  

  return (
    <Router>
      <NavPage />
      <Container id="main-content-container">
        <Switch>
          <Route exact path="/">
            <Suspense fallback={ renderLoader }>
              <HomePage />
            </Suspense>
          </Route>
          <Route path="/status">
            <Suspense fallback={ renderLoader }>
              <StatusPage />
            </Suspense>
          </Route>
          <Route path="/admin">
            <Suspense fallback={ renderLoader }>
              <AdminPage />
            </Suspense>
          </Route>
          <Suspense fallback={ renderLoader }>
            <Route path="/create/:id" component={CreateTagPage} />
          </Suspense>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
