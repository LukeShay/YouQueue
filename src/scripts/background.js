

console.log("script running.");

/* var cookieInfo = document.cookie;

if (cookieInfo === "")
{
    console.log("No cookie detected");
}
else{console.log(cookieInfo);} */

//Event listeners:

//-----Popup window opened
chrome.runtime.onConnect.addListener(requestHandler);


//Event Handlers:
var requestHandler = function(port)
{
    console.log("Message recieved");
    port.onMessage.addListener(function(request) {
        switch(request)
        {
            case "login_status":
                port.postMessage({response: {content: false}});
                break;
            default:
                break;
        }
    });
}




