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
    // here is where we list out the starting tags, data format first
    const startingTags = [{
        colorCode: 1,
        name: "Green Tag",
        secondLine: "Indoor",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 2,
        name: "Green Tag Deerhead",
        secondLine: "Indoor",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 3,
        name: "Bronze Tag",
        secondLine: "Lodges, etc.",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 4,
        name: "Outdoor Tag",
        secondLine: "Regular Black, Mtn Ops, etc.",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 12,
        name: "Outdoor Ski Patrol",
        secondLine: "Ski Patrol Only",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 13,
        name: "Old Black Card Tags",
        secondLine: "Old Mtn Ops Uniforms",
        thirdLine: "3rd Line Optional"
    },{
        colorCode: 11,
        name: "Ski / Basket Check",
        secondLine: "Click to Enter Details"
    },{
        colorCode: 5,
        name: "Custom Engraved Sign\nClick to Enter Details",
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