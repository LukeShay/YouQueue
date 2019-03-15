var port = chrome.runtime.connect({name: "knockknock"});
var loggedIn = port.postMessage({request: "login_status"});

port.onMessage.addListener(responseHandler);


var responseHandler = function(response)
{
    switch(response.request)
    {
        case "login_status":
            if (response.content === "logged_in")
            {
                console.print("User is logged in");
                break;
            }
            console.print("User is not logged in");
            break;
        default:
            console.print("No request found");
            break;
    }
}

  