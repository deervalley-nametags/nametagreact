import React from 'react';
import { 
    Col,
    Row,
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
    */
    //console.log(data);

    //text, mainly, capitalize first letter, then combine with a '/'
    const textToDisplay = (data.data.color[0].toUpperCase()) + (data.data.color.slice(1)) + " / " + (data.data.bg[0].toUpperCase()) + (data.data.bg.slice(1));

    //return page with compiled data
    return (
    <Container className={ "color-" + data.data.color + " bg-" + data.data.bg + " bg-basic" }>
        { textToDisplay }
    </Container>
    );
}

export default CreateSignColor;