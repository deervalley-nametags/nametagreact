import React from 'react';
import { 
    Container, 
    Button,
    Row,
    Col
} from 'react-bootstrap';
import '../css/nav.css';
import {
    NavLink
} from "react-router-dom";

function GotoStatusPage() {
    return (
        <Container className="nav-h4-bar-bg">
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        CLICK TAG TYPE TO GET STARTED or GOTO
                    </h4>
                </Col>
                <Col xs="auto">
                    <NavLink to="/status">
                        <Button>
                            ORDER STATUS
                        </Button>
                    </NavLink>
                </Col>
            </Row>
        </Container>
    );
  }
  
  export default GotoStatusPage;