/* console.log("content script running"); */
var isInterfaceCreated = false;


//-----Event Listeners

//Listens for runtime messages passed from other parts of the extension.
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) =>
    {
        /* console.log(document); */
        switch(message.sender)
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
);



//-----Event Handlers

//Handles messages passed from the background script
var handleBackgroundMessage = (message) =>
{
    switch(message.request)
    {
        case "showExtension":
            console.log("opening extension");
            manageUI("open");
            break;
        case "hideExtension":
            console.log("hiding extension");
            manageUI("hide");
        default:
            break;
    }
}

//Handles changes to the UI
var manageUI = option =>
{
    switch(option)
    {
        case "open":
            if (isInterfaceCreated)
            {
                /* document.getElementById("extensionUI").style.display = "block"; */
                openUI();
            }
            else
            {
                document.body.appendChild(getUI());
                openUI();
            }
            break;
        case "hide":
            closeUI();
            break;
        default:
            break;
    }
}



//-----Functions




var getUI = () =>
{
    let ui = document.createElement('div');
    ui.id = "extensionUI";
    ui.className = "extensionContainer";

    let overlay = document.createElement('div');
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    var uiCSS = document.createElement('link');
    uiCSS.setAttribute('rel', 'stylesheet');
    uiCSS.setAttribute('type', 'text/html');
    uiCSS.setAttribute('href', '../styles/extensionUI.css');
    document.getElementsByTagName('head')[0].appendChild(uiCSS);

    isInterfaceCreated = true;
    return ui;
}

var openUI = () =>
{
    document.getElementById("extensionUI").style.width = "250px";
    document.getElementById("overlay").style.opacity = 0.5;
}
  
var closeUI = () =>
{
    document.getElementById("extensionUI").style.width = "0";
    document.getElementById("overlay").style.opacity = 0;
}
