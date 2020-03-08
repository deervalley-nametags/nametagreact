import React, { 
    useState, 
    useRef, 
    useEffect
} from 'react';
import { 
    Container, 
    Button,
    Row,
    Col,
    FormControl,
    InputGroup,
    Spinner
} from 'react-bootstrap';
import {
    NavLink
} from "react-router-dom";
import '../css/nav.css';
import '../css/admin.css';
import { dbUtility } from './dbUtility.js';
import CreatePreviewImage from './CreatePreviewImage.js';
import StatusPage from './StatusPage.js';
import PrintOutdoorTag from './PrintOutdoorTag.js';


function copyToClipboard(id){
    //this will copy to clipboard the id e.g. "#admin-table-1"

    //convert to vanilla querySelector node
    let node = document.querySelector(id);

    //do range stuff, select
    let range  =  document.createRange();
    range.selectNodeContents(node);
    let select =  window.getSelection();
    select.removeAllRanges();
    select.addRange(range);

    //finally copy
    document.execCommand('copy');

    //add unselect here if wanted, but it helps to keep it selected
}


function AdminPage() {
    //admin title label
    const[adminLabel, setAdminLabel] = useState("ADMIN LOGIN");

    //show or hide an 'all tags are done good job' tag
    const[goodJobTag, setGoodJobTag] = useState(false);

    //tag rows of data, these MUST be filled with the data type or else it will freak out
    const[dataRowAdmin, setDataRowAdmin] = useState([{
        id: 0,
        data: {
            color: "",
            comments: "",
            requestor: "",
            datefinished: 0,
            daterequest: 0,
            reqDaysAgo: 0
        }
    }]);

    
    //rearrange rowData into dataByColor so we know what to show, and what to push where
    //for some reason, using useState here screws the pooch, so do all the data processing in dataByColor,
    //then at the very end update adminTodoTableData
    const[adminTodoTableData, setAdminTodoTableData] = useState([]);

    //admin function show/hide, true/false
    const[adminDisplay, setAdminDisplay] = useState(false);

    //which "copied to clipboard" index should it be displayed on
    const[copiedClipboardIndex, setCopiedClipboardIndex] = useState(-1);

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
            }).then( resolutionState => {
                //debug: proper admin auth
                //console.log(resolutionState);

                //switch panel views
                setAdminDisplay(true);

                //set the admin label
                setAdminLabel("ADMIN CENTER");

            }).catch( error => {
                //catch error and set title to the error message that traces from the tryLogin at dbUtility
                //console.log(error);
                setAdminLabel(error.msg);
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

            //setDataRowAdmin to the value of the db read
            //a console.log here will NOT work!
            setDataRowAdmin(statusTags);
        });
    }, []);

    //when dataRowAdmin updates
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
        let dataByColor = [];
       
        dataRowAdmin.forEach((item, index) => {
            //console.log(item);
            //item is straight from the db, e.g. item.id, or item.data.comments
            //adminTodoCode has the data format as a string: "<colorCode>-<number of lines>"
            let adminTodoCode;
            
            //check if 2 or 3 line, create the item's adminTodoCode 
            if(item.data.thirdline === ""){
                //empty string means 2 line
                adminTodoCode = "2-" + item.data.color;
            }else{
                //anything else means 3 line
                adminTodoCode = "3-" + item.data.color;
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
                comments: item.data.comments,
                requestor: item.data.requestor
            });
        });

        //console.log(dataByColor);

        //check to see if there are no tags still
        if(dataRowAdmin.length === 0){
            //update good job tag
            setGoodJobTag(true);
        }

        //after all of that, set adminTodoTableData to reflect the changes
        setAdminTodoTableData(dataByColor);
    },[dataRowAdmin]);


    //return
    return (
        <Container>
            <Row className="justify-content-between nav-h4-bar-bg px-0">
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
                <Row className="mt-2 px-0">
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
                //debug: change this to adminDisplay (true) not (false)
                adminDisplay &&
                <Container className="mt-2 mb-5 px-1">
                    <Row className="justify-content-center">
                        <h5 className="grey-text">The Following Tags Need to be Completed:</h5>
                    </Row>
                    {
                        (adminTodoTableData.length === 0 && !goodJobTag) &&
                        <Spinner variant="danger" animation="border" role="status">
                            <span className="sr-only">
                                Loading...
                            </span>
                        </Spinner>
                    }
                    {
                        goodJobTag &&
                        <Row className="justify-content-center">
                            <p className="green-text">All tags are completed. Good job, you!</p>
                        </Row>
                    }
                    {
                        adminTodoTableData.map((mapItem, index) => 
                            <Row className="admin-todo-item mt-2 py-3" key={ index } onClick={ () => {
                                //console.log(mapItem.adminTodoCode);
                                //on click, grab index and change copiedClipboardIndex
                                setCopiedClipboardIndex(index);

                                //copy clipboard with id, e.g. table-data-0 for index 0
                                copyToClipboard("#table-data-" + index);
                            }}>
                                <Col xs={ 12 } lg={ 4 } className="px-0">
                                    <Row>
                                        <Col>
                                            <CreatePreviewImage data={{ 
                                                colorCode: parseInt(mapItem.adminTodoCode.slice(2)),
                                                name: parseInt(mapItem.adminTodoCode[0]) === 2 ? "2 LINE" : "3 LINE"
                                            }} />
                                        </Col>
                                    </Row>
                                    {
                                        (copiedClipboardIndex === index ? true : false) &&
                                        <Row>
                                            <Col md={ 5 } className="ml-2 red-text">
                                                Copied to Clipboard!
                                            </Col>
                                            <Col md={ 5 } className="text-center">
                                                <p className="my-0">MARK THESE AS DONE:</p>
                                                <Button onClick={ () => {
                                                    //debug: what index of dataByColor was clicked?
                                                    //console.log(index);

                                                    //need to remap data from adminTodoTableData[index].data{ id: "" }
                                                    //to ["id","id","id"]
                                                    let reformattedData = [];
                                                    //console.log(adminTodoTableData[index].data);
                                                    adminTodoTableData[index].data.forEach((item) => {
                                                        reformattedData.push(item.id);
                                                    });

                                                    //console.log(reformattedData);
                                                    //send to dbUtility
                                                    dbUtility({
                                                        mode: "update_entry",
                                                        type: "done",
                                                        docIdArray: reformattedData
                                                    }).then(() => {
                                                        //here we need to re-set the dataRowAdmin
                                                        //grab all the unfinished tags using dbUtility promise
                                                        dbUtility({
                                                            mode: "read_all"
                                                        })
                                                        .then((statusTags) => {
                                                            //debug: this is what the promise resolved from in dbUtility()
                                                            //console.log(statusTags);

                                                            //setDataRowAdmin to the value of the db read
                                                            //a console.log here will NOT work!
                                                            setDataRowAdmin(statusTags);

                                                            //set copy clipboard index back to nothing
                                                            setCopiedClipboardIndex(-1);
                                                        });
                                                    });
                                                }}>&#10004;</Button>
                                            </Col>
                                        </Row>
                                    }
                                </Col>
                                <Col xs={ 6 } lg={ 4 } className="px-0">
                                    <table className="admin-table" id={ "table-data-" + index }>
                                        {
                                            !(mapItem.adminTodoCode[2] === "4") &&
                                            mapItem.data.map((mapItemChild, index) => 
                                                <tbody key={ mapItemChild.id }>
                                                    <tr>
                                                        <td className="admin-table-td">{ mapItemChild.name }</td>
                                                        <td className="admin-table-td">{ mapItemChild.secondLine }</td>
                                                        {
                                                            !(mapItemChild.thirdLine === "") &&
                                                            <td className="admin-table-td">{ mapItemChild.thirdLine }</td>
                                                        }
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-table-td">{ mapItemChild.name }</td>
                                                        <td className="admin-table-td">{ mapItemChild.secondLine }</td>
                                                        {
                                                            !(mapItemChild.thirdLine === "") &&
                                                            <td className="admin-table-td">{ mapItemChild.thirdLine }</td>
                                                        }
                                                    </tr>
                                                </tbody>
                                            )
                                        }
                                        {
                                            (mapItem.adminTodoCode[2] === "4") &&
                                            mapItem.data.map((mapItemChild, index) => 
                                                <tbody key={ mapItemChild.id }>
                                                    <tr>
                                                        <td className="admin-table-td-double">{ mapItemChild.name }</td>
                                                        <td className="admin-table-td-double">{ mapItemChild.secondLine }</td>
                                                        {
                                                            !(mapItemChild.thirdLine === "") &&
                                                            <td className="admin-table-td">{ mapItemChild.thirdLine }</td>
                                                        }
                                                    </tr>
                                                </tbody>
                                            )
                                        }
                                    </table >
                                </Col>
                                <Col xs={ 6 } lg={ 4 } className="pr-0">
                                    <table className="admin-table">
                                        {
                                            mapItem.data.map((mapItemChild, childIndex) => 
                                                <tbody key={ mapItemChild.id }>
                                                    <tr>
                                                        {
                                                            (mapItem.adminTodoCode[2] === "4") &&
                                                            <td className="admin-table-td-double">
                                                                <PrintOutdoorTag props={ mapItemChild } index={ index } />
                                                            </td>
                                                        }
                                                        <td className="admin-table-td-double">{ "Requestor: " + mapItemChild.requestor }</td>
                                                        <td className="admin-table-td-double">{ "Comments: " + mapItemChild.comments }</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        }
                                    </table>
                                </Col>
                            </Row>
                        )
                    }
                    <StatusPage adminMode={ true } dataRowAdmin={ dataRowAdmin } setDataRowAdmin={ setDataRowAdmin } />
                </Container>
            }
        </Container>
    );
  }
  
  export default AdminPage;