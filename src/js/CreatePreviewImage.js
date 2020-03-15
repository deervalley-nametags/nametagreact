import React from 'react';
import { 
    Col,
    Row,
    Container
} from 'react-bootstrap';
import '../css/tags.css';
import '../css/signcolor.css';

function colorCodeToClass(colorCode){
    /*
    tagType obj are the classes to apply and default texts on each
    bg background class, 
    img is the deer head logo, null-space is the default class that deletes the class
    in the event that there is no deer head
    defName: default Name placeholder
    defSecond: default second line text placeholder
    quantity: the default quantity for each tag type(unchangeable, only for info purposes)
    */
    let tagType = {
        bg: "",
        img: "null-space",
        defName: "Name",
        defSecond: "City, ST",
        quantity: "x2"
    };

    //translate color code to image type using classes
    if(colorCode === 1){
                
        //1: green pin no deerhead(normal nametag and default selection)
        tagType.bg = "tag-green";
    } else if(colorCode === 2){

        //2: green magnet deerhead
        tagType.bg = "tag-greenmag";
        tagType.img = "dvgold-img";
    } else if(colorCode === 3){

        //3: bronze magnet engraved deerhead
        tagType.bg = "tag-bronze";
        tagType.img = "dvwhite-img";
    } else if(colorCode === 4){

        //4: outdoor tags
        tagType.bg = "tag-outdoor";
        tagType.quantity = "x3";
    } else if(colorCode === 5){

        //5: sign, add details in comments
        tagType.bg = "tag-sign";
        tagType.defName = "Sign";
        tagType.defSecond = "Put details in the comments";
        tagType.quantity = "";
    } else if(colorCode === 7){

        //7: repeat 1 but with title instead of city, st
        tagType.bg = "tag-green";
        tagType.defSecond = "Title";
    } else if(colorCode === 8){

        //8: repeat 2 but with title instead of city, st
        tagType.bg = "tag-greenmag";
        tagType.img = "dvgold-img";
        tagType.defSecond = "Title";
    } else if(colorCode === 9){

        //9: repeat 3 but with title instead of city, st
        tagType.bg = "tag-bronze";
        tagType.img = "dvwhite-img";
        tagType.defSecond = "Title";
    } else if(colorCode === 10){

        //10: repeat 4 but with title instead of city, st
        tagType.bg = "tag-outdoor";
        tagType.defSecond = "Title";
        tagType.quantity = "x3";
    } else if(colorCode === 11){

        //11: basket check tag
        tagType.bg = "tag-basket";
        tagType.defName = "<p style='font-size:60px;position:relative;top:-20%;'>&#8226;</p>";
        tagType.defSecond = "<p style='font-size:19px;position:relative;bottom:30%;'>Basket Check</p>";
        tagType.quantity = "";
    } else{

        //anything else, other, details in comments
        tagType.bg = "tag-other";
    }

    //return value, e.g. tagType = { bg: tag-green, img: null-space }
    return tagType;
};


function CreatePreviewImage(data) {
    /*
    data use format for non signs: 
    <CreatePreviewImage data={ 
        name,
        secondLine,
        colorCode,
        thirdLine(if it exists)
    } />
    -
    data use format for signs: 
    <CreatePreviewImage data={ 
        name,
        height,
        width,
        signColor,
        attachment,
        thickness
    } />
    */

    //console.log(data); //correct injection would be e.g. data.data.colorCode
    let tagType = colorCodeToClass(data.data.colorCode);
    //console.log(tagType.img);
    tagType.bg = tagType.bg + "  justify-content-between";

    //if custom sign
    let pixelHeight;
    let pixelWidth;
    let splitClasses = [];
    let newLineContents = data.data.name;
    //console.log(data.data.colorCode);
    
    if(data.data.colorCode === 5){
        //grab signcolor classes
        //console.log(data.data.quantity);
        splitClasses = data.data.signColor.split(" / ");
        splitClasses[0] = "color-" + splitClasses[0].toLowerCase();
        splitClasses[1] = "bg-" + splitClasses[1].toLowerCase();
        
        pixelHeight = parseFloat(data.data.height);
        pixelWidth = parseFloat(data.data.width);

        //do sign math
        pixelHeight *= 50;
        pixelWidth *= 50;
        pixelHeight = pixelHeight + "px";
        pixelWidth = pixelWidth + "px";

        newLineContents = newLineContents.split("\n");
        //console.log(newLineContents);
    };
    

    //return page with compiled data
    return (
        <Col xs={12} md={6} lg={4} className="px-0">
            {
                (data.data.colorCode !== 5) &&
                <Container>
                    <Row className={ tagType.bg }>
                        {
                            !(tagType.img === "null-space") &&
                            <div className={ tagType.img }>
                            </div>
                        }
                        <div className="title-parent">
                            <div className="title-text justify-content-center">
                                { data.data.name }
                            </div>
                            <div className="smaller-text justify-content-center">
                                { data.data.secondLine }
                            </div>
                            <div className="smaller-text justify-content-center">
                                { data.data.thirdLine }
                            </div>
                        </div>
                    </Row>
                </Container>
            }
            {
                (data.data.colorCode === 5) &&
                <Container style={{ 
                    width: pixelWidth,
                    height: pixelHeight,
                    textAlign: "center",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "row"
                }} className={ splitClasses[1] + " " + splitClasses[0] + " bg-basic" }>
                    <div style={{ display: "flex", flexDirection: "column", margin: "auto" }}>
                        {
                            newLineContents.map((mapItem, index) => 
                                <Row className="justify-content-center" key={ index }>{ mapItem }</Row>
                            )
                        }
                    </div>
                </Container>
            }
        </Col>
    );
}

export default CreatePreviewImage;