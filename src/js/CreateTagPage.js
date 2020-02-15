import React from 'react';
import { 
    Container, 
    Button,
    Row,
    Col
} from 'react-bootstrap';
import {
    NavLink
} from "react-router-dom";
import '../css/nav.css';
import CreatePreviewImage from './CreatePreviewImage.js';

const CreateTagPage = ({ match, location }) => {
    console.log(match.params.id);
    //the number it grabs in the url is actually a string, so make it int
    let thisColorCode = parseInt(match.params.id);

    //live data for name and secondLine and thirdLine if applicable
    

    //return
    return (
        <Container>
            <Row className="justify-content-between nav-h4-bar-bg">
                <Col xs="auto" className="p-0">
                    <NavLink to="/">
                        <Button>
                            BACK TO STARTING TAG TYPES
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        CREATE A NEW TAG
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                    <NavLink to={"/createmultiple/" + match.params.id }>
                        <Button>
                            NEED MULTIPLES?
                        </Button>
                    </NavLink>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Row>Preview: </Row>
                    <Row><CreatePreviewImage data={{ colorCode: thisColorCode }} /></Row>
                </Col>
            </Row>
        </Container>
    );
};

  
  export default CreateTagPage;