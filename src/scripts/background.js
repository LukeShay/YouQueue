//JSON Object containing all extension info. Add variables here as needed.
var extInfo = {
    extensionOpened: false
}

var config = {
    apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    authDomain: "youqueue-c89b9.firebaseapp.com",
    databaseURL: "https://youqueue-c89b9.firebaseio.com",
    projectId: "youqueue-c89b9",
    storageBucket: "youqueue-c89b9.appspot.com",
    messagingSenderId: "420416303698"
};
firebase.initializeApp(config);
 
// Initialization Events/Actions:


//-----Event listeners:

//Popup window opened

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
    }
);

//-----Event Handlers

//-----Functions

//Constucts messages to be sent to other parts of the extension.
/* var constructTabMessage = (request, data, tab) =>
{
    let message = {
        sender: "background_script",
        request: request,
        data: data,
        currentTab: tab
    }

    return message;
} */










