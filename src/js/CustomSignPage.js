import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from "react-router-dom";

//layout import
import { 
    Container, 
    Button,
    Row,
    Col,
    InputGroup,
    FormControl,
    Dropdown
} from 'react-bootstrap';
import '../css/nav.css';
import '../css/signcolor.css';

//utility import
import CreateSignColor from './CreateSignColor.js';
import CreatePreviewImage from './CreatePreviewImage.js';
import { textValidation } from './textValidation.js';
import { dbUtility } from './dbUtility.js';


//start page
const CustomSignPage = () => {
    //this is to be able to load status window when tag created
    let history = useHistory();
    

    //set the submit array(same data format as multi tag) to default values
    const[ submitArray, setSubmitArray ] = useState([{
        color: 5,
        requestor: "",
        comments: "",
        attachment: "Attachment Style",
        name: "",
        signColor: "White / Green",
        signQuantity: 1,
        height: "Height(Inches)(Max 8.5\")",
        width: "Width(Inches)(Max 12\")",
        thickness: "Thickness"
    }]);


    //set the sign color data
    const signColorData = [{
        color: "white",
        bg: "green",
        title: "White / Green"
    },{
        color: "white",
        bg: "blue",
        title: "White / Blue"
    },{
        color: "black",
        bg: "bronze",
        title: "Black / Bronze"
    },{
        color: "black",
        bg: "orange",
        title: "Black / Orange"
    },{
        color: "white",
        bg: "brown",
        title: "White / Brown"
    },{
        color: "black",
        bg: "yellow",
        title: "Black / Yellow"
    },{
        color: "white",
        bg: "red",
        title: "White / Red"
    },{
        color: "black",
        bg: "red",
        title: "Black / Red"
    },{
        color: "black",
        bg: "white",
        title: "Black / White"
    },{
        color: "black",
        bg: "silver",
        title: "Black / Silver"
    },{
        color: "white",
        bg: "black",
        title: "White / Black"
    }];


    //submit button on request
    const submitRequest = () => {
        //check to make sure user hasn't done in-browser html magic to bypass disabled submit button
        //an empty or invalid request
        if(submitGrey === false){
            //pass, as its unlikely to change a react page variable in browser unless superuser

            //change status text to loading
            setStatusTextIndex(3);

            //db new entry
            dbUtility({
                mode: "new_entry",
                writeData: submitArray
            }).then(function(statusBack){
                //console.log(statusBack)
                //on success, navigate to /status
                history.push("/status");
            });
        }else{
            //failed, this shouldn't happen though
        };
    }

    /*
    //debug: what is submitArray on update
    useEffect(() => {
        console.log(submitArray);
    },[submitArray]);
    */

    //modify one element of the array
    const modifySubmitArray = (property, value, validation) => {
        //console.log(validation);
        //text validate if it wants it
        let validatedText;
        if(validation){
            validatedText = textValidation(value, 3);
        }else{
            validatedText = value;
        }

        //grab prior values except for changed element
        let priorSubmitObj = submitArray[0];
        priorSubmitObj[property] = validatedText;
        setSubmitArray([priorSubmitObj]);
    };


    //update the status text and disable/enable button
    useEffect(() => {
        //also update the submission status, e.g. you need X or Y to submit
        //if empty string or 0
        if(submitArray[0].name === "" && submitArray[0].requestor === ""){
            //false due to name AND requestor
            setSubmitGrey(true);
            setStatusTextIndex(0);
        }else if(submitArray[0].name === ""){
            //false only to name
            setSubmitGrey(true);
            setStatusTextIndex(2);
        }else if(submitArray[0].requestor === ""){
            //false only to requestor
            setSubmitGrey(true);
            setStatusTextIndex(1);
        }else if(submitArray[0].name !== "" && submitArray[0].requestor !== ""){
            //true only if name AND requestor are not empty strings set from textValidation
            setSubmitGrey(false);
            setStatusTextIndex(4);
        }else{
            //some other condition
            console.log("updateSubmitGrey() ran into some other condition on validation!");
        };

        //console.log(submitArray);

    },[submitArray]);


    //submit grey button text and status text
    const[ submitGrey, setSubmitGrey ] = useState(true);
    //for the status text, only the index of it changes, not the actual string [4] is empty string
    const statusText = [
        "There must be a requestor, Sign Content must be at least 3 characters.",
        "There must be a requestor.",
        "Sign Content must be at least 3 characters.",
        "Submitting...",
        ""
    ];
    const[ statusTextIndex, setStatusTextIndex ] = useState(0);

    //setting layout sizes
    const xsSize = 12;
    const mdSize = 6;

    //return
    return (
        <Container>
            <Row className="justify-content-between nav-h4-bar-bg">
                <Col xs="auto" className="p-0">
                    <NavLink to="/">
                        <Button>
                            BACK
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        NEW CUSTOM SIGN
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                    
                </Col>
            </Row>
            <Row className="mt-3 px-0 justify-content-center">
                Preview:
            </Row>
            <Row className="mt-3 px-0 justify-content-center">
                <Col xs="auto">
                    <CreatePreviewImage data={{ 
                        colorCode: 5, 
                        name: submitArray[0].name,
                        height: submitArray[0].height,
                        width: submitArray[0].width,
                        attachment: submitArray[0].attachment,
                        signColor: submitArray[0].signColor
                    }} />
                </Col>
            </Row>
            <Row>
                <InputGroup className="mt-4">
                    <FormControl
                        placeholder="Requestor (or: WHO to Mail it to)"
                        aria-label="Requestor"
                        onChange={ e => { modifySubmitArray("requestor", e.target.value, true); }} 
                    />
                </InputGroup>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        as="textarea"
                        placeholder="Sign Contents"
                        aria-label="Sign"
                        onChange={ e => { modifySubmitArray("name", e.target.value, true); }}
                    />
                </InputGroup>
            </Row>
            <Row>
                <Col xs={ 12 } md={ 4 } className="px-0">
                    <InputGroup className="mt-3">
                        <FormControl
                            placeholder={ submitArray[0].height }
                            aria-label="Height"
                            onChange={ e => { modifySubmitArray("height", e.target.value, false); }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={ 12 } md={ 4 } className="px-0 pl-md-2">
                    <InputGroup className="mt-3">
                        <FormControl
                            placeholder={ submitArray[0].width }
                            aria-label="Width"
                            onChange={ e => { modifySubmitArray("width", e.target.value, false); }}
                        />
                    </InputGroup>
                </Col>
                <Col xs={ 12 } md={ 4 } className="px-0 pl-md-2">
                    <InputGroup className="mt-3">
                        <Dropdown className="w-100">
                            <Dropdown.Toggle>
                                { submitArray[0].signColor }
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    signColorData.map( (mapItem, index) =>
                                        <Dropdown.Item 
                                            key={ index }
                                            onClick={ () => { modifySubmitArray("signColor", mapItem.title, false); }}>
                                            <CreateSignColor data={{ color: mapItem.color, bg: mapItem.bg }} />
                                        </Dropdown.Item>
                                    )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Col>
                
            </Row>
            <Row>
                <Col xs={ 12 } md={ 4 } className="px-0">
                    <InputGroup className="mt-3">
                        <Dropdown className="w-100">
                            <Dropdown.Toggle>
                                { submitArray[0].thickness }
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={ e => { modifySubmitArray("thickness", "Thin", false); }}>Thin</Dropdown.Item>
                                <Dropdown.Item onClick={ e => { modifySubmitArray("thickness", "Normal", false); }}>Normal</Dropdown.Item>
                                <Dropdown.Item onClick={ e => { modifySubmitArray("thickness", "Thick", false); }}>Thick</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Col>
                <Col xs={ 12 } md={ 4 } className="px-0 pl-md-2">
                    <InputGroup className="mt-3">
                        <Dropdown className="w-100">
                            <Dropdown.Toggle>
                                { submitArray[0].attachment }
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={ e => { modifySubmitArray("attachment", "Velcro", false); }}>Velcro</Dropdown.Item>
                                <Dropdown.Item onClick={ e => { modifySubmitArray("attachment", "Holes", false); }}>Holes</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Col>
                <Col xs={ 12 } md={ 4 } className="px-0 pl-md-2">
                    <InputGroup className="mt-3">
                        <FormControl
                            placeholder="Quantity"
                            aria-label="Sign Quantity"
                            onChange={ e => { modifySubmitArray("signQuantity", e.target.value, false); }}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        as="textarea"
                        placeholder="Comments"
                        aria-label="Comments"
                        onChange={ e => { modifySubmitArray("comments", e.target.value, false); }}
                    />
                </InputGroup>
            </Row>
            <Row className="mt-3 justify-content-end">
                <Col xs={xsSize} md={mdSize} lg="auto">
                    <p className="mt-2">{ statusText[statusTextIndex] }</p>
                </Col>
                <Col xs={xsSize} md={mdSize} lg="auto">
                    <Button type="submit" disabled={ submitGrey } onClick={ submitRequest }>Submit Request</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomSignPage;