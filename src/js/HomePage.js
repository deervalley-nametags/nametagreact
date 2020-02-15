import React from 'react';
import { 
    Container,
    Row
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
        <Container className="mt-2">
            <Row className="justify-content-between">
                {
                    startingTags.map(( mapItem, index ) => 
                        <NavLink to={'/create/' + mapItem.colorCode} key={ index }>
                            <CreatePreviewImage data={ mapItem } />
                        </NavLink>
                    )
                }
            </Row>
        </Container>
    );
}
  
export default HomePage;