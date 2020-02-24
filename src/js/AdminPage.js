import React, { useState, useRef, useEffect } from 'react';
import { 
    Container, 
    Button,
    Row,
    Col,
    FormControl,
    InputGroup
} from 'react-bootstrap';
import {
    NavLink
} from "react-router-dom";
import '../css/nav.css';
import '../css/admin.css';
import { dbUtility } from './dbUtility.js';
import CreatePreviewImage from './CreatePreviewImage.js';


function AdminPage() {
    //admin title label
    const[adminLabel, setAdminLabel] = useState("ADMIN LOGIN");

    //tag rows of data, these MUST be filled with the data type or else it will freak out
    const[dataRow, setDataRow] = useState([{
        id: 0,
        data: {
            color: "",
            comments: "",
            datefinished: 0,
            daterequest: 0,
            reqDaysAgo: 0
        }
    }]);
    
    //rearrange rowData into dataByColor so we know what to show, and what to push where
    const[dataByColor, setDataByColor] = useState([]);

    //construct the admin table using data
    const adminTableTemplate = [{
        colorCode: 1,
        name: "2 LINE"
    },{
        colorCode: 2,
        name: "2 LINE"
    },{
        colorCode: 2,
        name: "3 LINE"
    },{
        colorCode: 3,
        name: "2 LINE"
    },{
        colorCode: 3,
        name: "3 LINE"
    },{
        colorCode: 4,
        name: "2 LINE"
    },{
        colorCode: 4,
        name: "3 LINE"
    },{
        colorCode: 5,
        name: "SIGNS"
    },{
        colorCode: 11,
        name: "BASKET/SKI CHECK"
    }];

    //admin function show/hide, true/false
    const[adminDisplay, setAdminDisplay] = useState(false);

    //this is used to focus on the input
    const inputRef = useRef(null);

    //pass value
    const[adminPassValue, setAdminPassValue] = useState("");
    

    //on enter or submit, try to auth
    const tryLogin = (event) => {
        //first see if enter key
        //submit button will pass "enter" to pass this
        if(event.key === 'Enter' || event === "Button"){
            //debug: what was entered
            //console.log(adminPassValue);

            //dbUtility auth
            dbUtility({
                mode: "auth",
                authUser: "emeqiss@deervalley.com",
                authPass: adminPassValue
            }).then(() => {
                //debug: proper admin auth
                //console.log("gg");

                //switch panel views
                setAdminDisplay(true);

                //set the admin label
                setAdminLabel("ADMIN CENTER");
            });
        };
    };

    //on mount
    useEffect(() => {
        //focus on the admin pass input
        inputRef.current.focus();

        //grab all the unfinished tags using dbUtility promise
        dbUtility({
            mode: "read_all"
        })
        .then((statusTags) => {
            //debug: this is what the promise resolved from in dbUtility()
            //console.log(statusTags);

            //setDataRow to the value of the db read
            //a console.log here will NOT work!
            setDataRow(statusTags);
        });
    }, []);

    //when dataRow updates
    //rearrange it by color
    useEffect(() => {
        /*
        dataByColor format:
        [{
            colorCode: x,
            name: "2 LINE",
            data: [{
                id: "zBcs54S",
                name: "",
                secondLine: "",
                (thirdLine: "",)
                comments: ""
            },{},{},etc]
        },{},{},etc]
        */
        dataRow.forEach((item, index) => {
            //console.log(item);
            //adminTodoCode has the data format as a string: "<colorCode>-<number of lines>"
            let adminTodoCode;

            //check if 2 or 3 line, create the item's adminTodoCode
            if(item.data.thirdline === ""){
                //empty string means 2 line
                adminTodoCode = item.data.color + "-2";
            }else{
                //anything else means 3 line
                adminTodoCode = item.data.color + "-3";
            }

            //check to see if the colorCode exists yet in dataByColor
            let adminTodoCodeExists = dataByColor.filter(obj => obj.adminTodoCode === adminTodoCode);
            //console.log(adminTodoCodeExists[0]);
            if(typeof adminTodoCodeExists[0] == "undefined"){
                //did not find prior existing, so add it

                //if empty string, continue, who knows why it comes back with an empty string
                if(item.data.color === ""){
                    return;
                }

                //set oldValue to old value, push new, then set
                let oldValue = dataByColor;
                oldValue.push({
                    adminTodoCode: adminTodoCode,
                    data: []
                });
                
                setDataByColor(oldValue);
            }
            
            //debug: what does dataByColor look like when its only adding NEW types of adminTodoCodes
            //console.log(dataByColor);

            //grab the index which has the admin todo code we need to modify
            let adminTodoCodeIndex = dataByColor.findIndex(obj => obj.adminTodoCode === adminTodoCode);

            //set oldValue to what dataByColor used to be
            let oldValue = dataByColor;
            
            //valueToAdd needs to grab the 
            let valueToAdd = dataByColor[adminTodoCodeIndex];
            valueToAdd.data = [];
            
            
            valueToAdd.data.push({
                id: item.id,
                name: item.data.name
            });
            
            console.log(oldValue);
            setDataByColor(oldValue);

        });

        //console.log(dataByColor);
    },[dataRow]);

    //return
    return (
        <Container>
            <Row className="justify-content-between nav-h4-bar-bg">
                <Col xs="auto" className="p-0">
                    <NavLink to="/">
                        <Button>
                            HOME
                        </Button>
                    </NavLink>
                </Col>
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        { adminLabel }
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                    <NavLink to="/status">
                        <Button>
                            STATUS
                        </Button>
                    </NavLink>
                </Col>
            </Row>
            {
                !adminDisplay &&
                <Row className="mt-2">
                    <Col xs={ 10 } className="pl-0 pr-2">
                        <InputGroup>
                            <FormControl
                                ref={ inputRef }
                                placeholder="Password"
                                type="password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                onChange={ (e) => {
                                    //grab value
                                    let preValue = e.target.value;

                                    //on change, reupdate admin pass value
                                    setAdminPassValue( preValue );
                                }}
                                onKeyPress={ (e) => tryLogin(e) }
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={ 2 } className="px-0 align-right">
                        <Button id="submit-admin" onClick={ () => tryLogin("Button") }>
                            Submit
                        </Button>
                    </Col>
                </Row>
            }
            { 
                //debug: change this to adminDisplay
                !adminDisplay &&
                <Container className="mt-2 px-1">
                    <Row>
                        <h5 className="grey-text">The Following Tags Need to be Completed:</h5>
                    </Row>
                    {
                        adminTableTemplate.map((mapItem, index) => 
                            <Row className="admin-todo-item mt-2" key={ index }>
                                <Col xs={ 12 } lg={ 4 }>
                                    <CreatePreviewImage data={{ 
                                        colorCode: mapItem.colorCode,
                                        name: mapItem.name
                                    }} />
                                </Col>
                                <Col xs={ 12 } lg={ 2 }>
                                    Copied to Clipboard!
                                </Col>
                                <Col xs={ 12 } lg={ 6 }>
                                    <table className="admin-table">
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        )
                    }
                </Container>
            }
        </Container>
    );
  }
  
  export default AdminPage;