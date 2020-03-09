import React, { useEffect } from 'react';
import { 
    FormControl
} from 'react-bootstrap';
import '../css/datasheet.css';
import { textValidation } from './textValidation';

function ExcelTable(data) {
    /*
    this function is for excel table stuff
    -
    data format:
    tableData = [{
        name: "",
        secondLine: "",
        thirdLine: ""
    },{},{},etc]
    */
    //console.log(data);
    //console.log(data.setData);


    //debug: when data.data changes, log it
    useEffect(() => {
        //console.log(data.data);
    },[data.data]);


    //perform a cell change on key down and blur
    const doCellChange = (e) => {
        //console.log(e.key);
        
        //integerify the cell id
        let idX = parseInt(e.target.id[0]);
        let idY = parseInt(e.target.id.slice(2)); //need slice, because it might be multiple digits long
        
        //on enter, tab, or blur
        if(e.type === "blur" || e.key === "Enter" || e.key === "Tab"){
            //debug: value, then id
            //console.log("val: " + e.target.value);
            //console.log(e.target.id);
            
    
            //make change to cell by setting placeholder to value
            //first grab current data
            let oldTableData = data.data;

            //text validation
            let newValidatedValue = textValidation(e.target.value);
            
            //translate int X(0, 1, 2) to string object version(.name, .secondLine, .thirdLine)
            if(idX === 0){
                //set data to name
                oldTableData[idY].name = newValidatedValue;

                //recursively set the cells value to what the data says it should be
                e.target.value = data.data[idY].name;
            }else if(idX === 1){
                //set data to secondLine
                oldTableData[idY].secondLine = newValidatedValue;

                //recursively set the cells value to what the data says it should be
                e.target.value = data.data[idY].secondLine;
            }else{
                //set data to thirdLine
                oldTableData[idY].thirdLine = newValidatedValue;

                //recursively set the cells value to what the data says it should be
                e.target.value = data.data[idY].thirdLine;
            }
            
            //now update data
            //console.log(oldTableData[0].name);
            data.setData([...oldTableData]);

        }
        
        
        //only if enter key pressed, refocus on input below
        //tab doesnt need this because it does it by default
        if(e.key === 'Enter'){
            //use idY as index, grab ref+1, then strinfigy it
            let refToFocus = idY + 1;
            refToFocus = "0-" + refToFocus;

            //debug: react reference was acting funny, so vanilla js focus below
            //refArray.current[refToFocus].current.focus();
            document.getElementById(refToFocus).focus();
        };


        //arrow key pressing
        if(e.key === 'ArrowUp'){
            //use idY as index, grab ref+1, then strinfigy it
            let refToFocus = idY - 1;

            //error catching
            if(refToFocus < 0){
                refToFocus = 0;
            }

            //compile id string
            refToFocus = idX + "-" + refToFocus;


            //debug: react reference was acting funny, so vanilla js focus below
            //refArray.current[refToFocus].current.focus();
            document.getElementById(refToFocus).focus();
        }else if(e.key === 'ArrowDown'){
            //use idY as index, grab ref+1, then strinfigy it
            let refToFocus = idY + 1;
            refToFocus = idX + "-" + refToFocus;

            //debug: react reference was acting funny, so vanilla js focus below
            //refArray.current[refToFocus].current.focus();
            document.getElementById(refToFocus).focus();
        }else if(e.key === 'ArrowLeft'){
            //use idY as index, grab ref+1, then strinfigy it
            let refToFocus = idX - 1;

            //error catching
            if(refToFocus < 0){
                refToFocus = 2;
            }

            //compile id string
            refToFocus = refToFocus + "-" + idY;

            //debug: react reference was acting funny, so vanilla js focus below
            //refArray.current[refToFocus].current.focus();
            document.getElementById(refToFocus).focus();
        }else if(e.key === 'ArrowRight'){
            //use idY as index, grab ref+1, then strinfigy it
            let refToFocus = idX + 1;

            //error catching
            if(refToFocus > 2){
                refToFocus = 0;
            }

            //compile id string
            refToFocus = refToFocus + "-" + idY;

            //debug: react reference was acting funny, so vanilla js focus below
            //refArray.current[refToFocus].current.focus();
            document.getElementById(refToFocus).focus();
        };
    };


    //on focus, it will check if it is the last row, because of focus it will throw a hard
    //error if it is allowed to focus to a row that doesn't exist
    //so, if it doesn't exist on focus, create another row
    const checkAddCell = (e, index) => {
        //console.log(index);
        //console.log(data.data.length);
        if((index + 1) === data.data.length){
            data.setData([...data.data,{
                name: "",
                secondLine: "",
                thirdLine: ""
            }]);
        }

        //it will also select whole thing
        const toSelect = document.getElementById(e.target.id);
        toSelect.select();
    };


    //on paste
    const pasteData = (e) => {
        //debug: clipboard paste data
        //console.log(e.clipboardData.getData('Text'));
        //console.dir(e.target.value);

        //grab paste data, set a mutable table data set
        let dataToSplit = e.clipboardData.getData('Text');
        let oldTableData = data.data;

        //prevent it from actually pasting anything
        e.preventDefault()

        //grab origin index(X/Y index that was pasted into)
        let idX = parseInt(e.target.id[0]);
        let idY = parseInt(e.target.id.slice(2)); //need slice, because it might be multiple digits long

        //set originX so you can restore it later
        let originX = idX;
        //console.log("X: " + idX + " - Y: " + idY);


        //split by new line, then delete last empty array
        let splitByRow = dataToSplit.split("\n");
        splitByRow.pop();

        //for each row
        splitByRow.forEach((rowItem, rowIndex) => {
            let splitByCol = rowItem.split("\t");

            //for each column within each row
            splitByCol.forEach((colItem, colIndex) => {
                //console.log("X: " + idX + " - Y: " + idY + " - " + colItem);
                
                //text verify it
                let validatedValue = textValidation(colItem);
                
                //make the value equal to validated text
                //colItem.value = validatedValue;
                
                //main section where items must be inserted into old table data
                //translate int X(0, 1, 2) to string object version(.name, .secondLine, .thirdLine)
                if(idX === 0){
                    //name
                    oldTableData[idY].name = validatedValue;

                    //only if the cell is at origin
                    if(rowIndex === 0 && colIndex === 0){
                        //recursively set the cells value to what the data says it should be
                        e.target.value = data.data[idY].name;
                    }
                }else if(idX === 1){
                    //secondLine
                    oldTableData[idY].secondLine = validatedValue;

                    //only if the cell is at origin
                    if(rowIndex === 0 && colIndex === 0){
                        //recursively set the cells value to what the data says it should be
                        e.target.value = data.data[idY].secondLine;
                    }
                }else if(idX === 2){
                    //thirdLine
                    oldTableData[idY].thirdLine = validatedValue;

                    //only if the cell is at origin
                    if(rowIndex === 0 && colIndex === 0){
                        //recursively set the cells value to what the data says it should be
                        e.target.value = data.data[idY].thirdLine;
                    }
                }else{
                    //fourth column, just do nothing, this is the X overflow
                }

                //advance the col
                idX++;
            });

            //add row
            oldTableData.push({
                name: "",
                secondLine: "",
                thirdLine: ""
            });

            //advance the row and reset col
            idY++;
            idX = originX;
        });

        //update data
        data.setData([...oldTableData]);

        //this section used to be dedicated to focusing on the row below what was pasted,
        //but if that exceeded the table data length before it had a chance to update, then it would throw
        //error, and it is too much effort to program in such a small feature
        //console.log(splitByRow);
    }
    

    return(
        <table>
            <tbody>
                <tr>
                    <td className="td-cell">NAME / Ski-Basket Check #</td>
                    <td className="td-cell">City, ST / Title</td>
                    <td className="td-cell">Third Line</td>
                </tr>
                {
                    data.data.map((item, index) => 
                        <tr key={ index }>
                            <td className="td-cell">
                                <FormControl
                                    defaultValue={ item.name }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "0-" + index }
                                    onKeyDown={ (e) => {doCellChange(e) }}
                                    onBlur={ (e) => {doCellChange(e) }}
                                    onFocus={ (e) => {checkAddCell(e, index) }}
                                    onPaste={ (e) => {pasteData(e) }}
                                />
                            </td>
                            <td className="td-cell">
                                <FormControl
                                    defaultValue={ item.secondLine }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "1-" + index }
                                    onKeyDown={ (e) => {doCellChange(e) }}
                                    onBlur={ (e) => {doCellChange(e) }}
                                    onFocus={ (e) => {checkAddCell(e, index) }}
                                    onPaste={ (e) => {pasteData(e) }}
                                />
                            </td>
                            <td className="td-cell">
                                <FormControl
                                    defaultValue={ item.thirdLine }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "2-" + index }
                                    onKeyDown={ (e) => {doCellChange(e) }}
                                    onBlur={ (e) => {doCellChange(e) }}
                                    onFocus={ (e) => {checkAddCell(e, index) }}
                                    onPaste={ (e) => {pasteData(e) }}
                                />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
};

export default ExcelTable;