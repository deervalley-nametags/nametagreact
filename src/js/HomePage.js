import React from 'react';
import { 
    Container,
    Row
} from 'react-bootstrap';
import CreatePreviewImage from './CreatePreviewImage.js';

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
        secondLine: "City, ST"
    },{
        colorCode: 8,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 3,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 9,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 4,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 10,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 11,
        name: "Name",
        secondLine: "City, ST"
    },{
        colorCode: 5,
        name: "Name",
        secondLine: "City, ST"
    }];

    return (
        <Container className="mt-2">
            <Row className="justify-content-between">
                {
                    startingTags.map(( mapItem, index ) => 
                        <CreatePreviewImage data={ mapItem } key={ index } />
                    )
                }
            </Row>
        </Container>
    );
}
  
export default HomePage;