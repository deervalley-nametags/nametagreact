import React from 'react';
import { 
    Container,
    Row,
    Col
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
        colorCode: 7,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 2,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 8,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 3,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 9,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 4,
        name: "Name",
        secondLine: "Title"
    },{
        colorCode: 10,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 11,
        name: "Ski / Basket Check",
        secondLine: "Put Details in Comments"
    },{
        colorCode: 5,
        name: "Sign",
        secondLine: "Put Details in Comments"
    }];

    return (
        <Container className="mt-2 justify-content-center">
            <Row className="justify-content-between">
                {
                    startingTags.map(( mapItem, index ) => 
                        <Col className="p-0 mb-1 justify-content-center start-tag-container" xs="auto" key={ index }>
                            <div className="start-tag">
                                <NavLink to={ '/create/' + mapItem.colorCode }>
                                        <CreatePreviewImage data={ mapItem } />
                                </NavLink>
                            </div>
                        </Col>
                    )
                }
            </Row>
        </Container>
    );
}
  
export default HomePage;