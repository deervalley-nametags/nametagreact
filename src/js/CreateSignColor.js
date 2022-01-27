import React from 'react';
import { 
    Container
} from 'react-bootstrap';
import '../css/signcolor.css';

function CreateSignColor(data) {
    /*
    data use format: 
    <CreateSignColor data={ 
        color: "",
        bg: ""
    } />
    -
    appropriate string values for color and bg(lowercase):
    black
    bronze
    red
    white
    green
    brown
    silver
    blue
    orange
    yellow
    -
    tag id:s
    1: regular green
    2: green tag with gold deer head
    3: bronze with white deer head
    4: new: outdoor black bg with white deer head
    11: engraved sign
    12: outdoor patrol white bg with black cross and border
    13: old mtn ops uniform black card tags
    14: black diamond lodge silver
    15: regular black indoor
    16: club 1981 -- blk text, silver bg
    deprecated: 5, 6, 7, 8, 9
    */
    // console.log(data);

    // text, mainly, capitalize first letter, then combine with a '/'
    const textToDisplay = (data.data.color[0].toUpperCase()) + (data.data.color.slice(1)) + " / " + (data.data.bg[0].toUpperCase()) + (data.data.bg.slice(1));

    // return page with compiled data
    return (
    <Container className={ "color-" + data.data.color + " bg-" + data.data.bg + " bg-basic" }>
        { textToDisplay }
    </Container>
    );
}

export default CreateSignColor;