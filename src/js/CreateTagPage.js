import React, { useState, useEffect } from 'react';
import { useHistory, NavLink, useParams } from "react-router-dom";

// layout import
import { 
    Container, 
    Button,
    Row,
    Col,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import '../css/nav.css';

// utility import
import CreatePreviewImage from './CreatePreviewImage.js';
import { textValidation } from './textValidation.js';
import { dbUtility } from './dbUtility.js';


// start page
const CreateTagPage = () => {
    // ---------- VERSION CONTROL ----------
    const[latestVersion, setLatestVersion] = useState(-1);
    useEffect(() => {
        // database came back with version

        // grab localStorage
        let localVersion = localStorage.getItem("version");
        localVersion = parseInt(localVersion);
        if((localVersion !== latestVersion) && (latestVersion !== -1)){
            console.log("wrong local version: " + localVersion + " of latest: " + latestVersion);
            // if versions don't match(and it isn't the initial state of -1), force refresh
            window.location.reload(true);
            
            // update local
            localStorage.setItem("version", latestVersion);
        }else if(localVersion === latestVersion){
            console.log("running latest version");
        };
    },[latestVersion]);

    // grab appversion from "appVersion" tag in database
    dbUtility({
        mode: "get_app_version"
    }).then((appVersion) => {
        appVersion = parseInt(appVersion);
        setLatestVersion(appVersion);
    });



    
    // the number it grabs in the url is actually a string, so make it int
    let thisColorCode = parseInt(useParams().id);
    
    // debug: this should be the colorCode in the url e.g. /create/3 so "3"
    // console.log(thisColorCode);


    // this is to be able to load status window when tag created
    let history = useHistory();
    

    // set the submit array(same data format as multi tag) to default values
    const[ submitArray, setSubmitArray ] = useState([{
        name: "",
        color: thisColorCode,
        secondLine: "",
        thirdLine: "",
        requestor: "",
        comments: "",
        quantity: (() => { // new version of default quantity setter is an 'immediately invoked function expression'
            if(thisColorCode === 1){

                // plain green tag
                return "2-PINS";
            }else if(thisColorCode === 4 || thisColorCode === 12){

                // ski patrol and black outdoor tag with deerhead
                return "3-VELCRO"
            }else if(thisColorCode ===  13){

                // old mtn ops window tag
                return "3-CARDS"
            }else{

                // everything else
                return "2-MAGNETS"
            };
        })(),
        // old quantity setter was a ternary: (thisColorCode === 1) ? "2 PINS" : "2 MAGNETS"
    }]);


    // submit button on request
    const submitRequest = () => {
        // check to make sure user hasn't done in-browser html magic to bypass disabled submit button
        // an empty or invalid request
        if(submitGrey === false){
            // pass, as its unlikely to change a react page variable in browser unless superuser

            // change status text to loading
            setStatusTextIndex(3);

            // db new entry
            dbUtility({
                mode: "new_entry",
                writeData: submitArray
            }).then(function(statusBack){
                // console.log(statusBack)
                // on success, navigate to /status
                history.push("/status");
            });
        }else{
            // failed, this shouldn't happen though
        };
    }

    /*
    // debug: what is submitArray on update
    useEffect(() => {
        console.log(submitArray);
    },[submitArray]);
    */

    // update the status text and disable/enable button
    useEffect(() => {
        // also update the submission status, e.g. you need X or Y to submit
        // if empty string or 0
        if(submitArray[0].name === "" && submitArray[0].requestor === ""){
            // false due to name AND requestor
            setSubmitGrey(true);
            setStatusTextIndex(0);
        }else if(submitArray[0].name === ""){
            // false only to name
            setSubmitGrey(true);
            setStatusTextIndex(2);
        }else if(submitArray[0].requestor === ""){
            // false only to requestor
            setSubmitGrey(true);
            setStatusTextIndex(1);
        }else if(submitArray[0].name !== "" && submitArray[0].requestor !== ""){
            // true only if name AND requestor are not empty strings set from textValidation
            setSubmitGrey(false);
            setStatusTextIndex(4);
        }else{
            // some other condition
            console.log("updateSubmitGrey() ran into some other condition on validation!");
        };

    },[submitArray]);


    // submit grey button text and status text
    const[ submitGrey, setSubmitGrey ] = useState(true);
    // for the status text, only the index of it changes, not the actual string [4] is empty string
    const statusText = [
        "There must be a requestor, The Name on the tag must be at least 3 characters",
        "There must be a requestor.",
        "The Name on the tag must be at least 3 characters",
        "Submitting...",
        ""
    ];
    const[ statusTextIndex, setStatusTextIndex ] = useState(0);


    // setting layout sizes
    const xsSize = 12;
    const mdSize = 6;
    // const lgSize = 6;

    // return
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
                {
                    // color codes and their titles in the navbar
                    thisColorCode === 1 &&
                    <h4 className="nav-h4-bar">
                        NEW GREEN TAG
                    </h4>
                }
                {
                    thisColorCode === 2 &&
                    <h4 className="nav-h4-bar">
                        NEW GREEN DEERHEAD TAG
                    </h4>
                }
                {
                    thisColorCode === 3 &&
                    <h4 className="nav-h4-bar">
                        NEW BRONZE TAG
                    </h4>
                }
                {
                    thisColorCode === 14 &&
                    <h4 className="nav-h4-bar">
                        NEW BLACK DIAMOND LODGE TAG
                    </h4>
                }
                {
                    thisColorCode === 4 &&
                    <h4 className="nav-h4-bar">
                        NEW REGULAR OUTDOOR TAG
                    </h4>
                }
                {
                    thisColorCode === 12 &&
                    <h4 className="nav-h4-bar">
                        NEW OUTDOOR SKI PATROL TAG
                    </h4>
                }
                {
                    thisColorCode === 13 &&
                    <h4 className="nav-h4-bar">
                        NEW WINDOW TAG FOR UNDERARMOUR
                    </h4>
                }
                </Col>
                <Col xs="auto" className="p-0">
                    <NavLink to={"/createmultiple/" + thisColorCode }>
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
                                placeholder="Requestor's Name and Department"
                                aria-label="Requestor"
                                onChange={ e => {
                                    // text validate
                                    let validatedText = textValidation(e.target.value, 3);

                                    // only update if not false
                                    if(validatedText !== 0){
                                        // grab prior values except for changed element
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.requestor = validatedText;
                                        setSubmitArray([priorSubmitObj]);
                                    }else{
                                        // otherwise just set it to empty string
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.requestor = "";
                                        setSubmitArray([priorSubmitObj]);
                                    }
                                }}
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mt-3">
                            <FormControl
                                placeholder="Name on tag"
                                aria-label="Name"
                                onChange={ e => {
                                    // text validate
                                    let validatedText = textValidation(e.target.value, 3, true);

                                    // only update if not false
                                    if(validatedText !== 0){
                                        // grab prior values except for changed element
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.name = validatedText;
                                        setSubmitArray([priorSubmitObj]);
                                    }else{
                                        // otherwise just set it to empty string
                                        let priorSubmitObj = submitArray[0];
                                        priorSubmitObj.name = "";
                                        setSubmitArray([priorSubmitObj]);
                                    }
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
                        onChange={ e => {
                            // text validate
                            let validatedText = textValidation(e.target.value, 3, true);

                            // grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.secondLine = validatedText;
                            setSubmitArray([priorSubmitObj]);
                        }}
                    />
                </InputGroup>
            </Row>
            <Row>
                <InputGroup className="mt-3">
                    <FormControl
                        placeholder="Third Line(if applicable)"
                        aria-label="Third Line"
                        onChange={ e => {
                            // text validate
                            let validatedText = textValidation(e.target.value, 3, true);

                            // grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.thirdLine = validatedText;
                            setSubmitArray([priorSubmitObj]);
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
                        onChange={ e => {
                            // text validate
                            let validatedText = textValidation(e.target.value);

                            // grab prior values except for changed element
                            let priorSubmitObj = submitArray[0];
                            priorSubmitObj.comments = validatedText;
                            setSubmitArray([priorSubmitObj]);
                        }}
                    />
                </InputGroup>
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
                                            // if checked is true
                                            if(e.target.checked){
                                                // set value accordingly
                                                let oldSubmitArray = submitArray;
                                                oldSubmitArray[0].quantity = "2-PINS";
                                                setSubmitArray([...oldSubmitArray]);
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
                                            // if checked is true
                                            if(e.target.checked){
                                                // set value accordingly
                                                let oldSubmitArray = submitArray;
                                                oldSubmitArray[0].quantity = "2-MAGNETS";
                                                setSubmitArray([...oldSubmitArray]);
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
                                            // if checked is true
                                            if(e.target.checked){
                                                // set value accordingly
                                                let oldSubmitArray = submitArray;
                                                oldSubmitArray[0].quantity = "1-PIN + 1-MAGNET";
                                                setSubmitArray([...oldSubmitArray]);
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
            {
                (thisColorCode === 12 || thisColorCode === 4) &&
                <Row>
                    <Col>
                        <p className="mt-2 red-text">
                            Each name ordered will come with 3 outdoor tags with velcro.
                        </p>
                    </Col>
                </Row>
            }
            {
                (thisColorCode === 13) &&
                <Row>
                    <Col>
                        <p className="mt-2 red-text">
                            Each name ordered will come with 3 outdoor tags that should slip right into the window of the uniform.
                        </p>
                    </Col>
                </Row>
            }
            {
                (thisColorCode === 1 || thisColorCode === 2 || thisColorCode === 3 || thisColorCode === 14) &&
                <Row>
                    <Col>
                        <p className="mt-2 red-text">
                            Pins may be provided if magnet supply is low or out!
                            <br />
                            Deer Heads: Managers, Supervisors, Guest Svc, Directors, VPs, Attendants, Bronze Tags, Lodges, Fireside, and Chefs
                            <br />
                            Plain Tag: Everybody else
                        </p>
                    </Col>
                </Row>
            }
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