import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

//highest order variables
let namesRef; //db reference
let promiseReturn;

function loginAs(user, pass){
    return new Promise((resolve, reject) => {
        
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function() {
            //persistence types:
            //.NONE = reload will not keep session
            //.SESSION = reload will keep session, but closing and reopening will not
            
            return firebase.auth().signInWithEmailAndPassword(user, pass);
        })
        .then(function(){
            resolve(true);
        })
        .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            //console.log(errorCode + " -1- " + errorMessage);

            reject({
                code: errorCode,
                msg: errorMessage
            });
        });
    });
};

function checkAuth(){
    //check auth
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                // User is signed in.
                console.log("checkAuth() passed with user: " + user.email);
        
                resolve(user.email);
            }else{
                // No user is signed in.
                console.log("checkAuth() failed: no credentials.");
            };
        });

    });
};

export function dbUtility(utilityObj){
    /*
    this is a master use-all use-anywhere connect to db PROMISE
    so if you are switching from firebase to something else, you know
    exactly what needs to be replaced
    -
    its a promise because it relies on waiting on the authentication mainly
    so can use it like dbUtility({mode:""}).then(() => { //do stuff here });
    -
    utilityObj has the following data structure for its modes:
    {
        mode: "auth",
        authUser: "",
        authPass: ""
    }
    {
        mode: "new_entry",
        writeData: [{name:,requestor:,etc},{},//etc]
    }
    {
        mode: "search_for", //returns array full of found tags
        searchForString: "string to search"
    }
    {
        mode: "read_all" //returns array full of objects full of tags
    }
    {
        mode: "update_entry",
        type: "done" or "notdone"
        docIdArray: ["id","id","id",//etc]
    }
    */
   

   //if not yet initialized, initialize
   //debug: typeof firebase.apps[0] comes undefined if not previously init, or object if init
   //console.dir(typeof firebase.apps[0]);
   if(typeof firebase.apps[0] == "undefined"){
       //not init yet
       
       //firebase init using firestore
       firebase.initializeApp({
           apiKey: 'AIzaSyA1uPdDnmLSWqkuEkFlGH5YF7UvxvszceU',
           authDomain: 'nametags-4019a.firebaseapp.com',
           projectId: 'nametags-4019a'
        });
        
        //creation of db
        const db = firebase.firestore();
        namesRef = db.collection("names");
        
        //db authenticate as anon
        //scramble
        let sqrtNonPattern = Math.sqrt(4356);
        sqrtNonPattern = "iamanonymous" + sqrtNonPattern;
        sqrtNonPattern = sqrtNonPattern + "6";
        loginAs("anonymous@deervalley.com",sqrtNonPattern);
        
    }
    

    //authenticate
    if(utilityObj.mode === "auth"){
        return new Promise((resolve, reject) => {
            //first login, must wait so it is a promise
            loginAs(utilityObj.authUser, utilityObj.authPass).then( () => {
                //now we need to use check auth in order to grab the user
                checkAuth().then( returned => {
                    //only if user is admin, resolve
                    //console.log("pio " + returned);
                    resolve(returned);
                }).catch( error => {
                    
                });
            }).catch( error => {
                reject(error);
            });
        });
    };
    

    //mode check
    if(utilityObj.mode === "read_all"){
        /*
        read all mode, but because of read limits on google firebase free version, only
        grab the unfinished tags
        -
        set return type to array before pushing
        */
        promiseReturn = [];
        
        //return promise
        return new Promise((resolve, reject) => {

            //check auth before getting doc data
            checkAuth().then(function(){
                namesRef.where("datefinished", "==", 0).get().then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        //for each document found as unfinished, array push the following

                        //search for any matching id's in promiseReturn
                        //this section is because for some reason it was duplicating, so now it only does one once
                        let priorExistingId = promiseReturn.findIndex(obj => obj.id === doc.id);
                        if(priorExistingId === -1){
                            //-1 means it did not find a prior id, so go ahead
                            //array push the following
                            promiseReturn.push({
                                id: doc.id,
                                data: doc.data()
                            });
                        }else{
                            //anything else means if found something prior, so do nothing
                        }
                    });
                    resolve(promiseReturn);
                });
            });

        });


    }else if(utilityObj.mode === "search_for"){
        //search mode
        let promiseReturn = [];

        //return promise
        return new Promise((resolve, reject) => {
            //check auth before getting doc data
            checkAuth().then(function(){
                //grab results where name is being searched for
                namesRef.where("namearray", "array-contains-any", [utilityObj.searchForString]).get().then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        //for each document found, array push the following
                        promiseReturn.push({
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                }).then(function(){
                    //now grab all results where requestor could be searched for, this allows duplicate results
                    namesRef.where("requestorarray", "array-contains-any", [utilityObj.searchForString]).get().then(function(querySnapshot){
                        querySnapshot.forEach(function(doc){
                            //for each document found
                            
                            //search for any matching id's in promiseReturn
                            let priorExistingId = promiseReturn.findIndex(obj => obj.id === doc.id);
                            if(priorExistingId === -1){
                                //-1 means it did not find a prior id, so go ahead
                                //array push the following
                                promiseReturn.push({
                                    id: doc.id,
                                    data: doc.data()
                                });
                            }else{
                                //anything else means if found something prior, so do nothing
                            }
                        });
                        resolve(promiseReturn);
                    });
                });
            });
        });
    }else if(utilityObj.mode === "new_entry"){
        /*
        used for new entries
        data in:
        array[{name:"",requestor:"",secondLine:"",thirdLine:"",requestor:"",comments:""},{},{},etc]
        -
        set return type to array before pushing
        */
        promiseReturn = [];

        //debug: what does writeData come in as
        //console.log(utilityObj.writeData);

        //return promise
        return new Promise((resolve, reject) => {
            //check auth before submitting
            checkAuth().then(function(){
                utilityObj.writeData.forEach(function(arrayItem, index){
                    //console.log(arrayItem);

                    //lower casify and split name to an array, searching can be done easilyer
                    let tagName = arrayItem.name;
                    let tagRequestor = arrayItem.requestor;
                    let prependNameArray = tagName.toLowerCase();
                    let prependRequestorArray = tagRequestor.toLowerCase();
            
                    //before split, add temp var and prepend name to array, so "Jake Smith"
                    //looks like ["jake smith","jake","smith"]
                    let nameArray = prependNameArray.split(" ");
                    let requestorArray = prependRequestorArray.split(" ");
                    nameArray.unshift(prependNameArray);
                    requestorArray.unshift(prependRequestorArray);
                    
                    //grab current timestamp
                    let date = new Date();
                    let currentTimestamp = date.getTime();
            
                    //if sign, add only sign stuff
                    if(arrayItem.color === 5){
                        //sign
                        //make a new document in db, auto gen id
                        namesRef.add({
                            name: tagName,
                            namearray: nameArray,
                            color: 5,
                            attachment: arrayItem.attachment,
                            signcolor: arrayItem.signColor,
                            signquantity: arrayItem.signQuantity,
                            height: arrayItem.height,
                            width: arrayItem.width,
                            thickness: arrayItem.thickness,
                            requestor: tagRequestor,
                            requestorarray: requestorArray,
                            comments: arrayItem.comments,
                            daterequest: currentTimestamp,
                            datefinished: 0
                        }).then(function(){
                            //debug when writing is successful
                            //console.log("writing good");
                            resolve(true);
                        });
                    }else{
                        //anything other than sign
                        //make a new document in db, auto gen id
                        namesRef.add({
                            name: tagName,
                            namearray: nameArray,
                            color: arrayItem.color,
                            titlecity: arrayItem.secondLine,
                            thirdline: arrayItem.thirdLine,
                            requestor: tagRequestor,
                            requestorarray: requestorArray,
                            comments: arrayItem.comments,
                            daterequest: currentTimestamp,
                            datefinished: 0,
                            quantity: arrayItem.quantity
                        }).then(function(){
                            //debug when writing is successful
                            //console.log("writing good");
                            resolve(true);
                        });
                    }
                });
            });
        });

    }else if(utilityObj.mode === "auth"){
        //if auth is called here, just do nothing, as there is a section above that handles it,
        //but if this was empty it would throw some form of error
    }else if(utilityObj.mode === "update_entry"){
        //return promise
        return new Promise((resolve, reject) => {

            //update entry, mainly used to update if admin finished or unfinished a tag
            let currentTimestamp;

            //handle types
            if(utilityObj.type === "done"){
                //update to done
                //grab current timestamp
                let date = new Date();
                currentTimestamp = date.getTime();

            }else if(utilityObj.type === "notdone"){
                //update to not done, aka undo
                currentTimestamp = 0;
            }else{
                //mode not supported
            }

            //now update db for each
            utilityObj.docIdArray.forEach((item, index) => {
                //debug: does item come out as the doc Id?
                //console.log(item);
                
                namesRef.doc(item).update({
                    datefinished: currentTimestamp
                })
                .then(function() {
                    console.log("Document successfully written on update_entry()!");
                    resolve(true);
                })
                .catch(function(error) {
                    console.error("Error writing document on update_entry(): ", error);
                });

            });
        });
    }else{
        //something else encountered
        console.log("dbUtility() was called using a non supported utilityObj mode.");
        console.log("supported modes are 'read_all', 'search_for', 'new_entry', 'update_entry', or 'auth'.");
        console.log(utilityObj.mode);
    };

};
