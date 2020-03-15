import React, { useEffect } from 'react';
import { 
    Container,
    Button
} from 'react-bootstrap';
import '../css/print.css';
import { Print } from 'react-easy-print';



function PrintOutdoorTag(props){
    useEffect(() => {
        //debug: what is passed in as props
        //console.log(props.props);
        //console.log(props.index);
    },[props.props]);

    //combine id string
    let idString = "printframe" + props.index;
    
    let printString = "";
    //compile the final printing string, depending on third line existence
    if(props.props.thirdLine === ""){
        //empty string means two line
        printString = "<div style='text-align:center;'>" +
            "<p style='font-size:38px;font-family:calibri;margin-bottom:0px;margin-top:35px;'>" + props.props.name + "</p>" +
            "<p style='font-size:38px;font-family:calibri;margin-bottom:0px;margin-top:20px;'>" + props.props.secondLine + "</p>" +
        "</div>";
    }else{
        //anything else means third line
        printString = "<div style='text-align:center;'>" +
            "<p style='font-size:30px;font-family:calibri;margin-bottom:0px;margin-top:30px;'>" + props.props.name + "</p>" +
            "<p style='font-size:30px;font-family:calibri;margin-bottom:0px;margin-top:10px;'>" + props.props.secondLine + "</p>" +
            "<p style='font-size:30px;font-family:calibri;margin-bottom:0px;margin-top:10px;'>" + props.props.thirdLine + "</p>" +
        "</div>";
    }
    

    const tryPrint = () => {
        window.frames[idString].focus();
        window.frames[idString].print();
        window.frames[idString].close();
    };

    return(
        <Container>
            <Button onClick={ tryPrint }>
                PRINT
            </Button>
            <Print single name="print-class">
                <iframe id={ idString } title={ idString } name={ idString } srcDoc={ printString }>

                </iframe>
            </Print>
        </Container>
    );
}

export default PrintOutdoorTag;