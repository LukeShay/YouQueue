var extensionOpened = false;

console.log("script running.");

/* var cookieInfo = document.cookie;

if (cookieInfo === "")
{
    console.log("No cookie detected");
}
else{console.log(cookieInfo);} */

//Event listeners:

//-----Popup window opened
chrome.browserAction.onClicked.addListener(
    function()
    {
        if (extensionOpened)
        {
            extensionOpened = false;
        }
        else{
            console.log("Extension opened");
            extensionOpened = true;
        }
    }
);


//Event Handlers:





