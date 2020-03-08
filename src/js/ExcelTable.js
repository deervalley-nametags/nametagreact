import React from 'react';
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


    //perform a cell change on keydown
    const doCellChange = (e, fieldBlur) => {
        //if enter or tab key was pressed, set fieldBlur to true
        //this is so that it activates on enter, tab, OR blur
        if(e.key === 'Enter' || e.key === "Tab"){
            fieldBlur = true;
        };

        //integerify the cell id
        let idX = parseInt(e.target.id[0]);
        let idY = parseInt(e.target.id.slice(2)); //need slice, because it might be multiple digits long

        if(fieldBlur){
            //debug: value, then id
            //console.log(e.target.value);
            //console.log(e.target.id);

            //text verify it
            let validatedValue = textValidation(e.target.value);

            //make the value equal to validated text
            //e.target.value = validatedValue;

            //make change to cell by setting placeholder to value
            //first grab current data
            let oldTableData = data.data;
            
            //translate int X(0, 1, 2) to string object version(.name, .secondLine, .thirdLine)
            if(idX === 0){
                //name
                oldTableData[idY].name = validatedValue;
            }else if(idX === 1){
                //secondLine
                oldTableData[idY].secondLine = validatedValue;
            }else{
                //thirdLine
                oldTableData[idY].thirdLine = validatedValue;
            }
            
            //now update data
            //console.log(oldTableData);
            data.setData([...oldTableData]);
        };

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
    };


    //on focus, it will check if it is the last row, because of focus it will throw a hard
    //error if it is allowed to focus to a row that doesn't exist
    //so, if it doesn't exist on focus, create another row
    const checkAddCell = (index) => {
        //console.log(index);
        //console.log(data.data.length);
        if((index + 1) === data.data.length){
            data.setData([...data.data,{
                name: "",
                secondLine: "",
                thirdLine: ""
            }]);
        }
    };


    //on paste
    const pasteData = (e) => {
        //debug: clipboard paste data
        //console.log(e.clipboardData.getData('Text'));
        let dataToSplit = e.clipboardData.getData('Text');
        let oldTableData = data.data;

        //grab origin index(X/Y index that was pasted into)
        let idX = parseInt(e.target.id[0]);
        let idY = parseInt(e.target.id.slice(2)); //need slice, because it might be multiple digits long
        console.log("origins X: " + idX + " - Y: " + idY);

        //split by new line, then delete last empty array
        let splitByRow = dataToSplit.split("\n");
        splitByRow.pop();

        //for each row
        splitByRow.forEach((rowItem, index) => {
            let splitByCol = rowItem.split("\t");

            //for each column within each row
            splitByCol.forEach((colItem, index) => {
                console.log(colItem);

                //text verify it
                let validatedValue = textValidation(colItem);

                //make the value equal to validated text
                //colItem.value = validatedValue;

                //main section where items must be inserted into old table data
                //translate int X(0, 1, 2) to string object version(.name, .secondLine, .thirdLine)
                if(idX === 0){
                    //name
                    oldTableData[idY].name = colItem;
                }else if(idX === 1){
                    //secondLine
                    oldTableData[idY].secondLine = colItem;
                }else if(idX === 2){
                    //thirdLine
                    oldTableData[idY].thirdLine = colItem;
                }else{
                    //fourth column, just do nothing
                }

                

                //advance the col
                idX++;
            });

            //add row


            //advance the row and reset col
            idY++
            idX -= 3;
        });

        //update data
        data.setData([...oldTableData]);

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
                                    placeholder={ item.name }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "0-" + index }
                                    onKeyUp={ (e) => {doCellChange(e, false) }}
                                    onBlur={ (e) => {doCellChange(e, true) }}
                                    onFocus={ () => {checkAddCell(index) }}
                                    onPaste={ (e) => {pasteData(e) }}
                                />
                            </td>
                            <td className="td-cell">
                                <FormControl
                                    placeholder={ item.secondLine }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "1-" + index }
                                    onKeyUp={ (e) => {doCellChange(e, false) }}
                                    onBlur={ (e) => {doCellChange(e, true) }}
                                    onFocus={ () => {checkAddCell(index) }}
                                    onPaste={ (e) => {pasteData(e) }}
                                />
                            </td>
                            <td className="td-cell">
                                <FormControl
                                    placeholder={ item.thirdLine }
                                    className="cell-input"
                                    aria-label="cell input"
                                    id={ "2-" + index }
                                    onKeyUp={ (e) => {doCellChange(e, false) }}
                                    onBlur={ (e) => {doCellChange(e, true) }}
                                    onFocus={ () => {checkAddCell(index) }}
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