import React, { useEffect } from 'react';
import { 
    Container, 
    Button,
    Row,
    Col
} from 'react-bootstrap';
import { dbUtility } from './dbUtility.js';

import '../css/nav.css';

function StatusPage(){
    //grab all the unfinished tags
    let statusTags = dbUtility({
        mode: "read_all"
    });
    console.dir(statusTags);

    let authPromise = new Promise((resolve, reject) => {
        dbUtility({
            mode: "read_all"
        });
    });
    
    
    
    //return
    return (
        <Container>
            status page
        </Container>
    );
  }
  
  export default StatusPage;