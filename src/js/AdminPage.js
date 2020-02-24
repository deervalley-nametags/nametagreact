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
    //for some reason, using useState here screws the pooch, so do all the data processing in dataByColor,
    //then at the very end update adminTodoTableData
    let dataByColor = [];
    const[adminTodoTableData, setAdminTodoTableData] = useState([]);

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
            adminTodoCode: x,
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
            //item is straight from the db, e.g. item.id, or item.data.comments
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
            //console.log(adminTodoCode);
            
            //check to see if the colorCode exists yet in dataByColor
            let adminTodoCodeIndex = dataByColor.findIndex(obj => obj.adminTodoCode === adminTodoCode);
            //console.log(adminTodoCodeIndex);
            
            if(adminTodoCodeIndex === -1){
                //did not find prior existing, so add it

                //if empty string, continue, who knows why it comes back with an empty string
                if(item.data.color === ""){
                    return;
                }
                
                dataByColor.push({
                    adminTodoCode: adminTodoCode,
                    data: []
                });

            }
            //grab the index which has the admin todo code we need to modify
            adminTodoCodeIndex = dataByColor.findIndex(obj => obj.adminTodoCode === adminTodoCode);
            
            //grab the index, go to data array, then push new item into it
            dataByColor[adminTodoCodeIndex].data.push({
                id: item.id,
                name: item.data.name,
                secondLine: item.data.titlecity,
                thirdLine: item.data.thirdline,
                comments: item.data.comments
            });
            

        });

        console.log(dataByColor);

        //after all of that, set adminTodoTableData to reflect the changes
        setAdminTodoTableData(dataByColor);
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
                        adminTodoTableData.map((mapItem, index) => 
                            <Row className="admin-todo-item mt-2 py-3" key={ index }>
                                <Col xs={ 12 } lg={ 4 } className="px-0">
                                    <Row>
                                        <Col>
                                            <CreatePreviewImage data={{ 
                                                colorCode: parseInt(mapItem.adminTodoCode[0]),
                                                name: parseInt(mapItem.adminTodoCode[2]) === 2 ? "2 LINE" : "3 LINE"
                                            }} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="ml-2">
                                            abc
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={ 12 } lg={ 8 } className="px-0">
                                    <table className="admin-table">
                                            {
                                                mapItem.data.map((mapItem, index) => 
                                            <tbody key={ mapItem.id }>
                                                    <tr>
                                                        <td className="admin-table-td">{ mapItem.name }</td>
                                                        <td className="admin-table-td">{ mapItem.secondLine }</td>
                                                        <td className="admin-table-td">{ mapItem.thirdLine }</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-table-td">{ mapItem.name }</td>
                                                        <td className="admin-table-td">{ mapItem.secondLine }</td>
                                                        <td className="admin-table-td">{ mapItem.thirdLine }</td>
                                                    </tr>
                                        </tbody>
                                                )
                                            }
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