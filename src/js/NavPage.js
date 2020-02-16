import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import '../css/nav.css';
import {
    Switch,
    Route,
    NavLink
  } from "react-router-dom";
import GotoStatusPage from './GotoStatusPage.js';
import GotoHomePage from './GotoHomePage.js';

function NavPage() {
    return (
        <Container className="title-banner-container">
            <Navbar id="title-banner">
                <h3 id="banner-h3">
                    Deer Valley Nametags
                </h3>
                <NavLink to="/admin">
                    <Button id="admin-login-button">

                    </Button>
                </NavLink>
            </Navbar>
                <Switch>
                    <Route exact path="/">
                        <GotoStatusPage />
                    </Route>
                    <Route path="/status">
                        <GotoHomePage />
                    </Route>
                </Switch>
        </Container>
    );
  }
  
  export default NavPage;
  