import React, { useState, useEffect } from 'react';
import { useHistory, NavLink, useParams } from "react-router-dom";

//layout import
import { 
    Container, 
    Button,
    Row,
    Col,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap';
import '../css/nav.css';
import '../css/datasheet.css';
import ExampleImg from '../img/excel4.png';

//utility import
import CreatePreviewImage from './CreatePreviewImage.js';
import ExcelTable from './ExcelTable.js';
import { textValidation } from './textValidation.js';
import { dbUtility } from './dbUtility.js';


//start page
const CreateMultiTagPage = () => {
    //debug: this should be the colorCode in the url e.g. /create/3 so "3"
    //console.log(match.params.id);
    //the number it grabs in the url is actually a string, so make it int
    let thisColorCode = parseInt(useParams().id);


    //this is to be able to load status window when tag created
    let history = useHistory();


    //hide/show modal
    const[showExampleModal, setShowExampleModal] = useState(false);


    //comments and requestor temp storage
    const[tempComments, setTempComments] = useState("");
    const[tempRequestor, setTempRequestor] = useState("");
    const[tempQuantity, setTempQuantity] = useState((thisColorCode === 1) ? "2 PINS" : "2 MAGNETS");
    

    //set the submit array(same data format as multi tag) to default values
    const[ submitArray, setSubmitArray ] = useState([{
        name: "",
        color: thisColorCode,
        secondLine: "",
        thirdLine: "",
        requestor: "",
        comments: "",
        quantity: (thisColorCode === 1) ? "2 PINS" : "2 MAGNETS",
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


    //submit grey button text and status text
    const[ submitGrey, setSubmitGrey ] = useState(true);
    //for the status text, only the index of it changes, not the actual string [4] is empty string
    const statusText = [
        "There must be a requestor, there must be at least 1 name or check #",
        "There must be a requestor.",
        "The Name on the tag must be at least 3 characters",
        "Submitting...",
        ""
    ];
    const[ statusTextIndex, setStatusTextIndex ] = useState(0);


    //adding rows on button click
    const addRows = () => {
        let i;
        let inputData = [];

        //add 10 rows on click
        for(i = 0; i < 10; i++){
            //
            inputData.push({ name: "", secondLine: "", thirdLine: "" });
        }
        setTableData([...tableData,...inputData]);
    }


    //excel spreadsheet stuff
    const[tableData, setTableData] = useState([
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" },
        { name: "", secondLine: "", thirdLine: "" }
    ]);


    
    //update submitArray when excel table updates
    useEffect(() => {
        //console.dir(tableData);
        let dataToPush = [];
        let realIndex = 0;

        //it needs to shave off the empty lines
        tableData.forEach((item, index) => {
            
            //check just the name column in each
            if(item.name === ""){
                //if empty do nothing
            }else{
                //anything else means it has data, according to .name property
                
                //actual push it
                dataToPush.push(item);

                //add extra values
                dataToPush[realIndex].color = thisColorCode;
                dataToPush[realIndex].comments = tempComments;
                dataToPush[realIndex].requestor = tempRequestor;
                dataToPush[realIndex].quantity = tempQuantity;
                
                realIndex++;
            };
        });

        //update submitArray
        setSubmitArray([...dataToPush]);
    },[tableData,tempComments,tempRequestor,thisColorCode,tempQuantity]);
    


    //when submitArray updates
    useEffect(() => {
        //console.log(submitArray);

        //check submit grey button for errors
        //also update the submission status, e.g. you need X or Y to submit
        //if empty string or 0
        //console.log(submitArray.length);

        //catch an error where it replaces the template with nothing
        if(submitArray.length === 0){
            //
            setSubmitGrey(true);
            setStatusTextIndex(0);
        }else if(submitArray[0].name === "" && submitArray[0].requestor === ""){
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
            console.log("use Effect [submitArray] ran into some other condition on validation!");
        };
    },[submitArray]);


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
                            let validatedText = textValidation(e.target.value);
                            
                            //set temp requestor storage
                            setTempRequestor(validatedText);
                        }}
                    />
                </InputGroup>
            </Row>
            <Row className="justify-content-between">
                <Col xs={  12  } lg={ 3 }>
                    <Row className="mt-3">
                        <Button variant="primary" className="multi-left-button" onClick={ () => {
                            setShowExampleModal(true);
                        }}>
                            See Example
                        </Button>
                        <Modal size="xl" show={ showExampleModal } onHide={ () => {
                            setShowExampleModal(false);
                        }}>
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>

                                <img id="example-img-id" src={ ExampleImg } alt="example of how to paste from excel" />
                            </Modal.Body>
                        </Modal>
                    </Row>
                    <Row className="mt-3 justify-content-between">
                        <Button className="multi-left-button" onClick={ addRows }>
                            Add 10 Rows
                        </Button>
                    </Row>
                </Col>
                <Col xs={  12  } lg={ 9 } className="px-0 mt-3">
                    <InputGroup id="comment-box">
                        <FormControl
                            as="textarea"
                            placeholder="Comments"
                            aria-label="Comments"
                            aria-describedby="basic-addon1"
                            onChange={ e => {
                                //text validate
                                let validatedText = textValidation(e.target.value);

                                //set temp comments storage
                                setTempComments(validatedText);
                            }}
                        />
                    </InputGroup>
                </Col>

                
            </Row>
            <Row className="mt-3">
                <ExcelTable data={ tableData } setData={ setTableData } />
            </Row>
            {
                (thisColorCode === 1 || thisColorCode === 2 || thisColorCode === 3) &&
                <Row className="justify-content-between pinmag-row mt-3">
                    <Col xs={ 12 } md="auto" className="px-0">
                        <label className="mb-0">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Radio 
                                        name="pinmag" 
                                        aria-label="Radio for PIN" 
                                        defaultChecked={ (thisColorCode === 1) ? true : false }
                                        onChange={e => {
                                            //if checked is true
                                            if(e.target.checked){
                                                //set value accordingly
                                                setTempQuantity("2 PINS");
                                            }
                                        }}
                                    />
                                </InputGroup.Prepend>
                                <InputGroup.Append>
                                    <InputGroup.Text>2 PINS</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </label>
                    </Col>
                    <Col xs={ 12 } md="auto" className="px-0">
                        <label className="mb-0">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Radio 
                                        name="pinmag" 
                                        aria-label="Radio for PIN" 
                                        defaultChecked={ (thisColorCode !== 1) ? true : false }
                                        onChange={e => {
                                            //if checked is true
                                            if(e.target.checked){
                                                //set value accordingly
                                                setTempQuantity("2 MAGNETS");
                                            }
                                        }}
                                    />
                                </InputGroup.Prepend>
                                <InputGroup.Append>
                                    <InputGroup.Text>2 MAGNETS</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </label>
                    </Col>
                    <Col xs={ 12 } md="auto" className="px-0">
                        <label className="mb-0">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Radio 
                                        name="pinmag" 
                                        aria-label="Radio for PIN and MAG" 
                                        onChange={e => {
                                            //if checked is true
                                            if(e.target.checked){
                                                //set value accordingly
                                                setTempQuantity("1 PIN + 1 MAGNET");
                                            }
                                        }}
                                    />
                                </InputGroup.Prepend>
                                <InputGroup.Append>
                                    <InputGroup.Text>1 PIN + 1 MAGNET</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </label>
                    </Col>
                </Row>
            }
            <Row>
                <h5>Preview:</h5>

            </Row>
            <Row className="mt-3">
                {
                    submitArray.map((item, index) =>
                        <Col xs={ 12 } md={ 6 } lg={ 4 } key={ index }>
                            <CreatePreviewImage data={{ 
                                colorCode: thisColorCode, 
                                name: item.name,
                                secondLine: item.secondLine,
                                thirdLine: item.thirdLine
                            }} />
                        </Col>
                    )
                }
            </Row>
            <Row className="mt-3 justify-content-end">
                <Col xs={ 12 } md={ 12 } lg="auto">
                    <p className="mt-2">{ statusText[statusTextIndex] }</p>
                </Col>
                <Col xs={ 12 } md={ 12 } lg="auto">
                    <Button type="submit" disabled={ submitGrey } onClick={ submitRequest }>Submit Request</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateMultiTagPage;