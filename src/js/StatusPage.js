import React, { 
    useState, 
    useEffect,
    Suspense,
    lazy
} from 'react';
import { 
    Container, 
    Button,
    Row,
    Col,
    Spinner,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { dbUtility } from './dbUtility.js';
import '../css/nav.css';
import '../css/tags.css';
import '../css/admin.css';





// lazy loads
const CreatePreviewImage = lazy( () => import('./CreatePreviewImage.js'));


// lazy load spinner
const renderLoader = (
    <Spinner variant="danger" animation="border" role="status">
      <span className="sr-only">
        Loading...
      </span>
    </Spinner>
  );


// getting amount of days ago from current to requested date
const grabDaysAgo = ((requestTimestamp) => {
    // this was once a global thing, but it was having negative day errors when going live build
    let currentTimestamp = Date.now();

    // then for each item in data row, grab and assign the following
    let reqDaysAgo = (currentTimestamp - requestTimestamp) / 8640000;
    return((Math.floor(reqDaysAgo)) / 10);
});


// getting status class and accompanying text
const grabStatus = (dateFinished => {
    let returnObj = {};
    if(dateFinished === 0){
        // date finished is 0 which means unfinished
        returnObj.text = "Still Working...";
        returnObj.class = "status-yellow";
        return returnObj;
    }else if(dateFinished === -1){
        // -1 indicates a marked for duplicate entry
        returnObj.text = "Marked as Duplicate";
        returnObj.class = "status-red";
        return returnObj;
    }else{
        let currentTimestamp = Date.now();
        
        // date not 0, which means done, so get how many days ago done

        // how many days ago?
        let finDaysAgo = (currentTimestamp - dateFinished) / 8640000;
        finDaysAgo = Math.round(finDaysAgo) / 10;

        returnObj.text = "Finished " + finDaysAgo + " Days Ago!";
        returnObj.class = "status-green";
        return returnObj;
    };
});





function StatusPage(props){
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


    // debug: props.adminMode is true or false, props.dataRowAdmin would be the dataRowAdmin
    // console.log(props);

    // tag rows of data, these MUST be filled with the data type or else it will freak out
    const[dataRow, setDataRow] = useState([{
        id: 0,
        data: {
            color: "",
            comments: "",
            datefinished: 0,
            daterequest: 0,
            reqDaysAgo: 0,
            attachment: "",
            signColor: "White / Green",
            signQuantity: 1,
            height: 1,
            width: 1,
            thickness: ""
        }
    }]);

    // this is to show and hide a load spinner, for some reason suspense isn't working with the tags not showing up
    const[showPage, setShowPage] = useState(false);

    // display all tags system done tag
    const[tagsAreDone, setTagsAreDone] = useState(false);

    // search value
    const[searchValue, setSearchValue] = useState("");

    // container width padding, empty for normal mode, "px-0" for admin mode
    const[adminPadding, setAdminPadding] = useState("");

    // h4 title
    const[h4Title, setH4Title] = useState("STATUS for UNFINISHED TAGS:");

    // search bar placeholder
    const[searchBarPlaceholder, setSearchBarPlaceholder] = useState("Search Already Ordered Tags");

    // function for done or undo button clicked, only on admin page
    const tagsNeedUpdate = () => {
        // immediately set the loader
        setShowPage(false);
        

        // check if something was searched
        if(searchValue === ""){
            // empty string means no search query, so just read all mode

            // read everything again
            dbUtility({
                mode: "read_all"
            })
            .then((statusTags) => {
                // debug: this is what the promise resolved from in dbUtility()
                // console.log(statusTags);

                // setDataRow to the value of the db read
                setDataRow(statusTags);
                

                // if statusTags are empty, set the tags to show
                if(statusTags.length === 0){
                    setTagsAreDone(true);
                }

                // hide manual non suspense spinner
                setShowPage(true);

                // update lift state up for admin page
                props.setDataRowAdmin(statusTags);
            });
            
        }else{
            // anything else means search query, so search for mode
            // console.log(searchValue);

            // immediately show loader spinner
            setH4Title(renderLoader);

            // this is only for the admin page
            dbUtility({
                mode: "read_all"
            })
            .then((statusTags) => {
                // update lift state up for admin page
                props.setDataRowAdmin(statusTags);

            })
            .then(() => {

                // this is for the status page, but only when it is on admin mode
                dbUtility({
                    mode: "search_for",
                    searchForString: searchValue
                }).then((returnResult) => {
                    // returnResult is an array of documents that match
                    setDataRow(returnResult);
    
                    
                }).then(() => {
                    // show result
                    setShowPage(true);

                    // immediately show loader spinner
                    setH4Title("Results for: " + searchValue);
                });
            });

        };

        
    };


    // run once only on mount
    useEffect(() => {
        

        // grab all the unfinished tags using dbUtility promise
        dbUtility({
            mode: "read_all"
        })
        .then((statusTags) => {
            // debug: this is what the promise resolved from in dbUtility()
            // console.log(statusTags);

            // setDataRow to the value of the db read
            // a console.log here will NOT work!
            setDataRow(statusTags);

            // if statusTags are empty, set the tags to show
            if(statusTags.length === 0){
                setTagsAreDone(true);
            }

            // hide manual non suspense spinner
            setShowPage(true);
        });
    },[]);

    // run when dataRowAdmin updates
    useEffect(() => {
        // debug: did passing state down work?
        // console.log("456");

        // now update itself to reflect changes
        dbUtility({
            mode: "read_all"
        })
        .then((statusTags) => {
            // debug: this is what the promise resolved from in dbUtility()
            // console.log(statusTags);

            // setDataRow to the value of the db read
            // a console.log here will NOT work!
            setDataRow(statusTags);

            // if statusTags are empty, set the tags to show
            if(statusTags.length === 0){
                setTagsAreDone(true);
            }

            // hide manual non suspense spinner
            setShowPage(true);
        });
    },[props.dataRowAdmin]);


    useEffect(() => {
        // set h4 title and search bar placeholder on adminmode
        if(props.adminMode){
            setH4Title("Edit Individual Tag Status");
            setSearchBarPlaceholder("Search for Specific Tags");
            setAdminPadding("px-0");
        }
    },[props.adminMode]);


    useEffect(() => {
        // console.log(dataRow);
    },[dataRow]);


    // return
    return (
        <Container className={ adminPadding }>
            <Row className="justify-content-between mt-1 nav-h4-bar-bg print-hide">
                {
                    !props.adminMode &&
                    <Col xs="auto" className="p-0">
                        <NavLink to="/">
                            <Button>
                                BACK
                            </Button>
                        </NavLink>
                    </Col>
                }
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        { h4Title }
                    </h4>
                </Col>
                <Col xs="auto" className="p-0">
                <InputGroup id="status-search-bar">
                    <FormControl
                        placeholder={ searchBarPlaceholder }
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        id="status-search-bar-inner"
                        onChange={ (e) => {
                            // on value change set searchValue to string
                            let thisSearchValue = e.target.value;

                            // lower casify it
                            thisSearchValue = thisSearchValue.toLowerCase();

                            setSearchValue(thisSearchValue);
                        }}
                        onKeyPress={ (e) => {
                            if(e.key === 'Enter'){
                                // if enter was pressed
                                // console.log(searchValue);

                                // if search value is empty, reset
                                if(searchValue === ""){
                                    // set the h4 title
                                    setH4Title("Edit Individual Tag Status");

                                    dbUtility({
                                        mode: "read_all"
                                    })
                                    .then((statusTags) => {
                                        // debug: this is what the promise resolved from in dbUtility()
                                        // console.log(statusTags);
                            
                                        // setDataRow to the value of the db read
                                        // a console.log here will NOT work!
                                        setDataRow(statusTags);
                            
                                        // if statusTags are empty, set the tags to show
                                        if(statusTags.length === 0){
                                            setTagsAreDone(true);
                                        }
                            
                                        // hide manual non suspense spinner
                                        setShowPage(true);
                                    });
                                }else{
                                    // immediately show loader spinner
                                    setH4Title(renderLoader);
    
    
                                    // search using dbUtility
                                    dbUtility({
                                        mode: "search_for",
                                        searchForString: searchValue
                                    }).then((returnResult) => {
                                        // sort by not done first, so admin page is easier to match tags
                                        console.log(returnResult);

                                        // returnResult is an array of documents that match
                                        setDataRow(returnResult);
    
                                        // set the h4 title
                                        setH4Title("Results for: " + searchValue);
                                    });
                                };
                            }
                        }}
                    />
                </InputGroup>
                </Col>
            </Row>
            {
            (!showPage) &&
            <Row>
                <Spinner variant="danger" animation="border" role="status">
                    <span className="sr-only">
                        Loading...
                    </span>
                </Spinner>
            </Row>
            }
            {
                (tagsAreDone && !props.adminMode) &&
                <Row className="justify-content-center mt-2">
                    <h5 className="green-text mt-2">All tags in the system are done.</h5>
                </Row>
            }
            {
                showPage &&
                dataRow.map((mapItem, index) => 
                    <Row className="mt-1 justify-content-between status-row" key={ "status-" + mapItem.id }>
                        {
                            props.adminMode &&
                            <Col xs={ 12 } md={ 1 } className="px-0">
                                <Row className="justify-content-center mt-1">
                                    <Col xs="auto">
                                        <Button 
                                            variant="success" 
                                            className="admin-change-status-button"
                                            disabled={ 
                                                grabStatus(mapItem.data.datefinished).class === "status-green" ? true : false 
                                            }
                                            onClick={ () => {
                                                // update the entry with DONE
                                                let tempIdArray = [];
                                                tempIdArray.push(mapItem.id);
                                                dbUtility({
                                                    mode: "update_entry",
                                                    type: "done",
                                                    docIdArray: tempIdArray
                                                }).then(() => {
                                                    // somehow need to re-update

                                                    tagsNeedUpdate();
                                                });
                                            }}>
                                            &#10004;
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="justify-content-center mt-1">
                                    <Col xs="auto">
                                        <Button 
                                            variant="danger" 
                                            className="admin-change-status-button"
                                            disabled={ 
                                                grabStatus(mapItem.data.datefinished).class === "status-green" ? true : false 
                                            }
                                            onClick={ () => {
                                                // update the entry with DONE
                                                let tempIdArray = [];
                                                tempIdArray.push(mapItem.id);
                                                dbUtility({
                                                    mode: "update_entry",
                                                    type: "duplicate",
                                                    docIdArray: tempIdArray
                                                }).then(() => {
                                                    // somehow need to re-update

                                                    tagsNeedUpdate();
                                                });
                                            }}>
                                            &#x2398;
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="justify-content-center mt-1">
                                    <Col xs="auto">
                                        <Button 
                                            variant="warning" 
                                            className="admin-change-status-button"
                                            disabled={ 
                                            grabStatus(mapItem.data.datefinished).class === "status-yellow" ? true : false 
                                        }
                                        onClick={ () => {
                                            // debug: grab id of item clicked on
                                            // console.log(mapItem.id);
                                            let tempIdArray = [];
                                            tempIdArray.push(mapItem.id);

                                            // update the entry with UNDO / notdone
                                            dbUtility({
                                                mode: "update_entry",
                                                type: "notdone",
                                                docIdArray: tempIdArray
                                            }).then(() => {
                                                // somehow need to re-update
                                                tagsNeedUpdate();
                                            });
                                        }}>
                                            &#10226;
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        }
                        <Col xs={ 12 } md={ props.adminMode ? 5 : 6 } className="px-0">
                            <Suspense fallback={ renderLoader }>
                                {
                                    (mapItem.data.color !== 5) &&
                                    <CreatePreviewImage data={{ 
                                        name: mapItem.data.name,
                                        secondLine: mapItem.data.titlecity,
                                        thirdLine: mapItem.data.thirdline,
                                        colorCode: mapItem.data.color
                                    }} />
                                }
                                {
                                    (mapItem.data.color === 5) &&
                                    <CreatePreviewImage data={{ 
                                        name: mapItem.data.name,
                                        colorCode: 5,
                                        signColor: mapItem.data.signcolor,
                                        attachment: mapItem.data.attachment,
                                        height: mapItem.data.height,
                                        width: mapItem.data.width
                                    }} />
                                }
                            </Suspense>
                        </Col>
                        <Col xs={ 12 } md={ 4 } className="px-0">
                            <Row>
                                <Col>
                                    <p className="status-b-col-text">Requestor: { mapItem.data.requestor }</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p className="status-b-col-text">Requested: { grabDaysAgo(mapItem.data.daterequest) } Days Ago</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        (mapItem.data.color !== 5) &&
                                        <p className="status-b-col-text">Quantity: { mapItem.data.quantity }</p>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p className="status-b-col-text">Comments: { mapItem.data.comments }</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={ 12 } md={ 2 } className={ grabStatus(mapItem.data.datefinished).class }>
                            <p>STATUS: { grabStatus(mapItem.data.datefinished).text }</p>
                        </Col>
                    </Row>
                )
            }
        </Container>
    );
  }
  
  export default StatusPage;