import React from 'react';
import { 
    Container, 
    Button,
    Row,
    Col,
    FormControl

} from 'react-bootstrap';
import {
    NavLink
} from "react-router-dom";
import '../css/nav.css';

function AdminPage() {
    return (
        <Container>
            <Row className="justify-content-between nav-h4-bar-bg">
                <Col xs="auto" className="p-0">
                    <NavLink to="/">
                        <Button>
                            HOME
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        ADMIN LOGIN
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                    <NavLink to="/status">
                        <Button>
                            STATUS
                        </Button>
                    </NavLink>
                </Col>
            </Row>
            <Row>
                
            </Row>
        </Container>
    );
  }
  
  export default AdminPage;