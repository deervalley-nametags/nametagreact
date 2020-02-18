import React, { useState } from 'react';
import { useHistory, NavLink, useParams } from "react-router-dom";

//layout import
import { 
    Container, 
    Button,
    Row,
    Col,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import '../css/nav.css';

//utility import
import CreatePreviewImage from './CreatePreviewImage.js';
import { textValidation } from './textValidation.js';
import { dbUtility } from './dbUtility.js';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';


//start page
const CreateTagPage = () => {
    //debug: this should be the colorCode in the url e.g. /create/3 so "3"
    //console.log(match.params.id);
    //the number it grabs in the url is actually a string, so make it int
    let thisColorCode = parseInt(useParams().id);

    //this is to be able to load status window when tag created
    let history = useHistory();
    

    //set the submit array(same data format as multi tag) to default values
    const[ submitArray, setSubmitArray ] = useState([{
        name: "",
        color: thisColorCode,
        secondLine: "",
        thirdLine: "",
        requestor: "",
        comments: ""
    }]);


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


    //update the status text and disable/enable button
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
                            BACK
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        MULTIPLE TAGS
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                    
                </Col>
            </Row>
            <Row className="mt-3">
                <InputGroup>
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
                <Col xs={ xsSize } lg={ 6 }>
                    <Row className="mt-3">
                        <Button>
                            See an Example
                        </Button>
                    </Row>
                    <Row>
                        
                    </Row>
                </Col>
                <Col xs={ xsSize } lg={ 6 }>
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
                </Col>

                
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

  
  export default CreateTagPage;