import React, {
    useState, 
    useEffect,
} from 'react';
import { 
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap';
import '../css/nav.css';
import CreatePreviewImage from './CreatePreviewImage.js';
import { dbUtility } from './dbUtility.js';
import {
    NavLink
} from "react-router-dom";


function HomePage() {
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
    //console.log("version check");



    // here is where we list out the starting tags, data format first
    const startingTags = [{
        colorCode: 1,
        name: "Green Tag",
        secondLine: "Indoor",
        thirdLine: ""
    },{
        colorCode: 2,
        name: "Green Tag Deerhead",
        secondLine: "Indoor",
        thirdLine: ""
    },{
        colorCode: 3,
        name: "Bronze Tag",
        secondLine: "Indoor Lodges",
        thirdLine: ""
    },{
        colorCode: 15,
        name: "Black Tag",
        secondLine: "Indoor",
        thirdLine: ""
    },{
        colorCode: 14,
        name: "Black Diamond Tag",
        secondLine: "-----------------------------",
        thirdLine: "Black Diamond Lodge"
    },{
        colorCode: 16,
        name: "Club 1981 Tag",
        secondLine: "Club 1981",
        thirdLine: ""
    },{
        colorCode: 4,
        name: "Outdoor Velcro Tag",
        secondLine: "Regular Outdoor",
        thirdLine: ""
    },{
        colorCode: 12,
        name: "Ski Patrol",
        secondLine: "Ski Patrol Only",
        thirdLine: ""
    },{
        colorCode: 13,
        name: "Old Black Card Tags",
        secondLine: "Old Under Armour Window Tags",
        thirdLine: ""
    },/*{
        colorCode: 11,
        name: "Ski / Basket Check",
        secondLine: "Click to Enter Details"
    },*/{
        colorCode: 5,
        name: "Custom Engraved Sign\nClick to Enter Details",
        signColor: "White / Blue",
        width: 7,
        height: 3
    }];

    return (
        <Container className="mt-1 justify-content-center">
            <Row className="justify-content-center nav-h4-bar-bg">
                <Col xs="auto">
                    <h4 className="nav-h4-bar">
                        CLICK TAG TYPE TO GET STARTED or GOTO
                    </h4>
                </Col>
                <Col xs="auto">
                    <NavLink to="/status">
                        <Button>
                            ORDER STATUS
                        </Button>
                    </NavLink>
                </Col>
            </Row>
            <Row className="justify-content-between mt-3">
                {
                    startingTags.map(( mapItem, index ) => 
                        <Col className="p-0 mb-1 justify-content-center start-tag-container" xs="auto" key={ index }>
                            {
                                (mapItem.colorCode !== 5) &&
                                <div className="start-tag">
                                    <NavLink to={ '/create/' + mapItem.colorCode }>
                                            <CreatePreviewImage data={ mapItem } />
                                    </NavLink>
                                </div>
                            }
                            {
                                (mapItem.colorCode === 5) &&
                                <div className="start-tag-sign">
                                    <NavLink to={ '/sign' }>
                                            <CreatePreviewImage data={ mapItem } />
                                    </NavLink>
                                </div>
                            }
                        </Col>
                    )
                }
            </Row>
        </Container>
    );
}
  
export default HomePage;