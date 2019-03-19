//JSON Object containing all extension info. Add variables here as needed.
var extInfo = {
    extensionOpened: false
}

// Initialization Events/Actions:
/* console.log("background script running."); */


//-----Event listeners:

//Popup window opened
chrome.browserAction.onClicked.addListener(() =>
    {
        if (extInfo.extensionOpened)
        {
            manageExtension("hideExtension");
            extInfo.extensionOpened = false;
        }
        else{
            /* console.log("Extension opened"); */
            manageExtension("showExtension");
            extInfo.extensionOpened = true;
       }
    }
);

/* chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) =>
    {
        console.log("recieved message");
        switch(message.from)
        {
            case "background_script":
                handleBackgroundMessage(message);
                break;
            default:
                break;
        }

        sendResponse({message: "goodbye"});
        return true;
    }
); */











//-----Event Handlers

//Handles the opening and closing of the extension
var manageExtension = action =>
{
    chrome.tabs.query({"active": true, "currentWindow": true}, 
        tab => {chrome.tabs.sendMessage(tab[0].id, constructTabMessage(action, extInfo, tab[0]), 
            response => {}
        )}
    );
}




//-----Functions

//Constucts messages to be sent to other parts of the extension.
var constructTabMessage = (request, data, tab) =>
{
    let message = {
        sender: "background_script",
        request: request,
        data: data,
        currentTab: tab
    }

    return message;
}











