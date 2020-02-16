import React, { useState, useEffect } from 'react';
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
import CreatePreviewImage from './CreatePreviewImage.js';
import { textValidation } from './textValidation.js';
import { dbUtility } from './dbUtility.js';

const CreateTagPage = ({ match, location }) => {
    //debug: this should be the colorCode in the url e.g. /create/3 so "3"
    //console.log(match.params.id);
    //the number it grabs in the url is actually a string, so make it int
    let thisColorCode = parseInt(match.params.id);

    //set the submit array(same data format as multi tag) to default values
    const[ submitArray, setSubmitArray ] = useState([{
        name: "",
        secondLine: "",
        thirdLine: "",
        requestor: "",
        comments: ""
    }]);

    //submit grey button text and status text
    const[ submitGrey, setSubmitGrey ] = useState(true);
    //for the status text, only the index of it changes, not the actual string [4] is empty string
    const statusText = [
        "There must be a requestor, the Name must be at least 3 characters.",
        "There must be a requestor.",
        "The Name on the tag must be at least 3 characters",
        "Submitting...",
        ""
    ];
    const[ statusTextIndex, setStatusTextIndex ] = useState(0);
    const updateSubmitGrey = () => {
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
    };

    //setting layout sizes
    const xsSize = 12;
    const mdSize = 6;
    //const lgSize = 6;

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
            <Row className="mt-3">
                <Col xs={xsSize} md={mdSize} lg={4} className="justify-content-center">
                    <Row>Preview: </Row>
                    <Row>
                        <CreatePreviewImage data={{ 
                            colorCode: thisColorCode, 
                            name: submitArray[0].name,
                            secondLine: submitArray[0].secondLine,
                            thirdLine: submitArray[0].thirdLine
                        }} />
                    </Row>
                </Col>
                <Col xs={xsSize} md={mdSize} lg={8}>
                    <Row>
                        <InputGroup className="mt-4">
                            <FormControl
                                placeholder="Requestor (or: WHO to Mail it to)"
                                aria-label="Requestor"
                                aria-describedby="basic-addon1"
                                onChange={ e => {
                                    //text validate
                                    let preValue = e.target.value;
                                    let postValue = textValidation(preValue, 3);

                                    //grab prior values except for changed element
                                    let priorSubmitObj = submitArray[0];
                                    priorSubmitObj.requestor = postValue;
                                    setSubmitArray([priorSubmitObj]);

                                    //update submit grey button
                                    updateSubmitGrey();
                                }}
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mt-3">
                            <FormControl
                                placeholder="Name on tag(or sign title)"
                                aria-label="Name"
                                aria-describedby="basic-addon1"
                                onChange={ e => {
                                    //text validate
                                    let preValue = e.target.value;
                                    let postValue = textValidation(preValue, 3);

                                    //only update if not false
                                    if(postValue !== 0){
                                        //grab prior values except for changed element
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.name = postValue;
                                        setSubmitArray([priorSubmitObj]);
                                    }else{
                                        //otherwise just set it to empty string
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.name = "";
                                        setSubmitArray([priorSubmitObj]);
                                    }

                                    

                                    //update submit grey button
                                    updateSubmitGrey();
                                }}
                            />
                        </InputGroup>
                    </Row>
                </Col>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        placeholder="Title OR: City, ST"
                        aria-label="Second Line"
                        aria-describedby="basic-addon1"
                        onChange={ e => {
                            //text validate
                            let preValue = e.target.value;
                            let postValue = textValidation(preValue);

                            //grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.secondLine = postValue;
                            setSubmitArray([priorSubmitObj]);

                            //update submit grey button
                            updateSubmitGrey();
                        }}
                    />
                </InputGroup>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        placeholder="Third Line(if applicable)"
                        aria-label="Third Line"
                        aria-describedby="basic-addon1"
                        onChange={ e => {
                            //text validate
                            let preValue = e.target.value;
                            let postValue = textValidation(preValue);

                            //grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.thirdLine = postValue;
                            setSubmitArray([priorSubmitObj]);

                            //update submit grey button
                            updateSubmitGrey();
                        }}
                    />
                </InputGroup>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        as="textarea"
                        placeholder="Comments"
                        aria-label="Comments"
                        aria-describedby="basic-addon1"
                        onChange={ e => {
                            //text validate
                            let preValue = e.target.value;
                            let postValue = textValidation(preValue);

                            //grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.comments = postValue;
                            setSubmitArray([priorSubmitObj]);

                            //update submit grey button
                            updateSubmitGrey();
                        }}
                    />
                </InputGroup>
            </Row>
            <Row className="mt-3 justify-content-end">
                <Col xs={xsSize} md={mdSize} lg="auto">
                    <p className="mt-2">{ statusText[statusTextIndex] }</p>
                </Col>
                <Col xs={xsSize} md={mdSize} lg="auto">
                    <Button type="submit" disabled={ submitGrey }>Submit Request</Button>
                </Col>
            </Row>
        </Container>
    );
};

  
  export default CreateTagPage;