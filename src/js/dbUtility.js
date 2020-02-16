import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

//highest order variable, db
let namesRef;
let returnArray = [];

function loginAs(user, pass){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function() {
        //persistence types:
        //.NONE = reload will not keep session
        //.SESSION = reload will keep session, but closing and reopening will not
        
        return firebase.auth().signInWithEmailAndPassword(user, pass);
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });
};

export function dbUtility(utilityObj){
    /*
    this is a master use-all use-anywhere connect to db function
    so if you are switching from firebase to something else, you know
    exactly what needs to be replaced
    -
    utilityObj has the following data structure for its modes:
    {
        mode: "auth",
        authUser: "",
        authPass: ""
    }
    {
        mode: "new_entry",
        writeData: submitArray[{name:,requestor:,etc},{},//etc]
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
        docId: "",
        dateFinished: 00000000
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
        loginAs(utilityObj.authUser, utilityObj.authPass);
    };


    //mode check
    if(utilityObj.mode === "read_all"){
        //read all mode, but because of read limits on google firebase free version, only
        //grab the unfinished tags

        //because it often ends up running before user is authenticated, need to do a promise
        
        /*
        let authPromise = new Promise((resolve, reject) => {
            //check auth
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    //console.dir("resolved");
                    resolve(true);
                }else{
                    //debug: promise is still pending
                    //console.dir("pending");
                };
            });
        });
        authPromise.then(() => {
            //this section only runs after a user is logged in
            namesRef.where("datefinished", "==", 0).get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    returnArray.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                console.dir(returnArray);
                return returnArray;
            });
            
        });
*/
        
    }else if(utilityObj.mode === "search_for"){
        //search mode
    }else if(utilityObj.mode === "new_entry"){
        //used for new entries
    }else if(utilityObj.mode === "auth"){
        //if auth is called here, just do nothing
    }else if(utilityObj.mode === "update_entry"){
        //update entry, mainly used to update if admin finished or unfinished a tag
    }else{
        //something else encountered
        console.log("dbUtility() was called using a non supported utilityObj mode.");
        console.log("supported modes are 'read_all', 'search_for', 'new_entry', 'update_entry', or 'auth'.");
        console.log(utilityObj.mode);
    };

    
    //check auth
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            // User is signed in.
            console.log("Logged in as: " + user.email);

            
        }else{
            // No user is signed in.
            console.log("Not currently logged in.");
        };
    });
    
    

    
    
};
