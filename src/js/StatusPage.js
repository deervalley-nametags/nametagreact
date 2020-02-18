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
    Spinner
} from 'react-bootstrap';
import { dbUtility } from './dbUtility.js';
import '../css/nav.css';
import '../css/tags.css';


//compile time data, grab the date once, needs to be here due to scope
let date = new Date();
let currentTimestamp = date.getTime();


//lazy loads
const CreatePreviewImage = lazy( () => import('./CreatePreviewImage.js'));


//lazy load spinner
const renderLoader = (
    <Spinner variant="danger" animation="border" role="status">
      <span className="sr-only">
        Loading...
      </span>
    </Spinner>
  );


//getting amount of days ago from current to requested date
const grabDaysAgo = ((requestTimestamp) => {
    //then for each item in data row, grab and assign the following
    let reqDaysAgo = (currentTimestamp - requestTimestamp) / 8640000;
    reqDaysAgo = Math.round(reqDaysAgo) / 10;

    return reqDaysAgo;
});


//getting status class and accompanying text
const grabStatus = (dateFinished => {
    let returnObj = {};
    if(dateFinished === 0){
        //date finished is 0 which means unfinished
        returnObj.text = "Still Working...";
        returnObj.class = "status-yellow";
        return returnObj;
    }else{
        //date not 0, which means done, so get how many days ago done

        //how many days ago?
        let finDaysAgo = (currentTimestamp - dateFinished) / 8640000;
        finDaysAgo = Math.round(finDaysAgo) / 10;

        returnObj.text = "Finished " + finDaysAgo + " Days Ago!";
        returnObj.class = "status-green";
        return returnObj;
    };
});


function StatusPage(){
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


    //run once only on mount
    useEffect(() => {
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
    },[]);


    //return
    return (
        <Container>
            {
                dataRow.map((mapItem, index) => 
                    <Row className="mt-1 justify-content-between status-row" key={ index }>
                        <Col xs={ 5 } className="px-0">
                            <Suspense fallback={ renderLoader }>
                                <CreatePreviewImage data={{ 
                                    name: mapItem.data.name,
                                    secondLine: mapItem.data.titlecity,
                                    colorCode: mapItem.data.color
                                }} />
                            </Suspense>
                        </Col>
                        <Col xs={ 5 } className="px-0">
                            <Row>
                                <p className="status-b-col-text">Requestor: { mapItem.data.requestor }</p>
                            </Row>
                            <Row>
                            <p className="status-b-col-text">Requested: { grabDaysAgo(mapItem.data.daterequest) } Days Ago</p>
                            </Row>
                            <Row>
                                <p className="status-b-col-text">Comments: { mapItem.data.comments }</p>
                            </Row>
                        </Col>
                        <Col xs={ 2 } className={ grabStatus(mapItem.data.datefinished).class }>
                            <p>STATUS: { grabStatus(mapItem.data.datefinished).text }</p>
                        </Col>
                    </Row>
                )
            }
        </Container>
    );
  }
  
  export default StatusPage;