import React from 'react';
import { 
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap';
import CreatePreviewImage from './CreatePreviewImage.js';
import {
    NavLink
} from "react-router-dom";

function HomePage() {
    //here is where we list out the starting tags, data format first
    const startingTags = [{
        colorCode: 1,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 1,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 1,
        name: "Name",
        secondLine: "Title",
        thirdLine: "Department"
    },{
        colorCode: 2,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 2,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 2,
        name: "Name",
        secondLine: "Title",
        thirdLine: "Department"
    },{
        colorCode: 3,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 3,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 3,
        name: "Name",
        secondLine: "Title",
        thirdLine: "Department"
    },{
        colorCode: 4,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 4,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 4,
        name: "Name",
        secondLine: "Title",
        thirdLine: "Department"
    },{
        colorCode: 11,
        name: "Ski / Basket Check",
        secondLine: "Click to Enter Details"
    },{
        colorCode: 5,
        name: "Custom Sign\nClick to Enter Details",
        signColor: "White / Blue",
        width: 7,
        height: 3
    }];

    return (
        <Container className="mt-1 justify-content-center">
            <Row className="justify-content-center nav-h4-bar-bg">
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
            <Row className="justify-content-between mt-3">
                {
                    startingTags.map(( mapItem, index ) => 
                        <Col className="p-0 mb-1 justify-content-center start-tag-container" xs="auto" key={ index }>
                            {
                                (mapItem.colorCode !== 5) &&
                                <div className="start-tag">
                                    <NavLink to={ '/create/' + mapItem.colorCode }>
                                            <CreatePreviewImage data={ mapItem } />
                                    </NavLink>
                                </div>
                            }
                            {
                                (mapItem.colorCode === 5) &&
                                <div className="start-tag-sign">
                                    <NavLink to={ '/sign' }>
                                            <CreatePreviewImage data={ mapItem } />
                                    </NavLink>
                                </div>
                            }
                        </Col>
                    )
                }
            </Row>
        </Container>
    );
}
  
export default HomePage;