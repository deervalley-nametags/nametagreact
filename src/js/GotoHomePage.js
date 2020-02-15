import React from 'react';
import { 
    Container, 
    Button,
    Row,
    Col,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import {
    NavLink
} from "react-router-dom";
import '../css/nav.css';

function GotoHomePage() {
    return (
        <Container className="nav-h4-bar-bg">
            <Row className="justify-content-between">
                <Col xs="auto" className="p-0">
                    <NavLink to="/">
                        <Button>
                            BACK
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        STATUS for UNFINISHED TAGS:
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                <InputGroup id="status-search-bar">
                    <FormControl
                        placeholder="Search Already Ordered Tags"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                </Col>
            </Row>
        </Container>
    );
  }
  
  export default GotoHomePage;