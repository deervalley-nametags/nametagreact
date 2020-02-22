import React from 'react';
import { 
    Col,
    Row,
    Container
} from 'react-bootstrap';
import '../css/datasheet.css';

function ExcelTable(data) {
    //this function is for excel table stuff
    console.log(data.data);
    console.log(data.setData);
    

    return(
        <table>
            <tbody>
                <tr>
                    <td>NAME / Ski-Basket Check #</td>
                    <td>City, ST / Title</td>
                    <td>Third Line</td>
                </tr>
                {
                    data.data.map((item, index) => 
                        <tr key={ index }>
                            <td>{ item.name }</td>
                            <td>{ item.secondLine }</td>
                            <td>{ item.thirdLine }</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
};

export default ExcelTable;