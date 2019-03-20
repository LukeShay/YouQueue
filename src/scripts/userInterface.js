/* console.log("content script running"); */
var isInterfaceCreated = false;
var interfaceElements = {
    interface: {
        container: null,
        overlay: null,
        css: null
    }
}


//-----Event Listeners

//Listens for runtime messages passed from other parts of the extension.
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) =>
    {
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
            manageUI("open");
            break;
        case "hideExtension":
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
                loadAuthPage();
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




/* var getUI = () =>
{
    let ui = document.createElement('div');
    ui.id = "extensionUI";
    ui.className = "extensionContainer";
    interfaceElements.interface.container = ui;

    let overlay = document.createElement('div');
    overlay.id = "overlay";
    document.body.appendChild(overlay);
    interfaceElements.interface.overlay = overlay;

    var uiCSS = document.createElement('link');
    uiCSS.setAttribute('rel', 'stylesheet');
    uiCSS.setAttribute('type', 'text/html');
    uiCSS.setAttribute('href', '../styles/extensionUI.css');
    document.getElementsByTagName('head')[0].appendChild(uiCSS);
    interfaceElements.interface.css = uiCSS;

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

var loadAuthPage = () =>
{
    chrome.runtime.sendMessage(constructMessage("getAuthState", ""), 
        () =>
        {
            return true;
        }
    );




    /* var xhr= new XMLHttpRequest();
    xhr.open('GET', '../html/authentication.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        document.getElementById('extensionUI').innerHTML= this.responseText;
    };
    xhr.send(); */



var constructMessage = (request, data) =>
{
    let message = {
        sender: "interface_script",
        request: request,
        data: data,
    }

    return message;
}
