import React, { lazy, Suspense } from 'react';
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
import PrintProvider from 'react-easy-print';

//lazy imports
const HomePage = lazy( () => import('./HomePage.js'));
const StatusPage = lazy( () => import('./StatusPage.js'));
const AdminPage = lazy( () => import('./AdminPage.js'));
const CustomSignPage = lazy( () => import('./CustomSignPage.js'));
const CreateTagPage = lazy( () => import('./CreateTagPage.js'));
const CreateMultiTagPage = lazy( () => import('./CreateMultiTagPage.js'));

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
    <PrintProvider>
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
              <StatusPage adminMode={ false } />
            </Suspense>
          </Route>
          <Route path="/admin">
            <Suspense fallback={ renderLoader }>
              <AdminPage />
            </Suspense>
          </Route>
          <Route path="/create/:id">
            <Suspense fallback={ renderLoader }>
              <CreateTagPage />
            </Suspense>
          </Route>
          <Route path="/sign">
            <Suspense fallback={ renderLoader }>
              <CustomSignPage />
            </Suspense>
          </Route>
          <Route path="/createmultiple/:id">
            <Suspense fallback={ renderLoader }>
              <CreateMultiTagPage />
            </Suspense>
          </Route>
        </Switch>
      </Container>
    </Router>
    </PrintProvider>
  );
}

export default App;
