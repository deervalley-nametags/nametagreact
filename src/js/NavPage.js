import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import '../css/nav.css';
import { NavLink } from "react-router-dom";

function NavPage() {
    return (
        <Container className="title-banner-container print-hide">
            <Navbar id="title-banner">
                <h3 id="banner-h3">
                    Deer Valley Nametags
                </h3>
                <p id="under-banner">
                    Empire Signshop
                </p>
                <p id="advisory">
                    
                </p>
                <NavLink to="/admin">
                    <Button id="admin-login-button">

                    </Button>
                </NavLink>
            </Navbar>
        </Container>
    );
  }
  
  export default NavPage;
  