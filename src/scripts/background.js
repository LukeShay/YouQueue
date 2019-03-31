/* document.write('<audio id="player" src="../resources/Adele - Hello.mp3" >');
document.getElementById('player').play(); */

chrome.runtime.onMessage.addListener((message, sender, sendRepsonse) =>
{
    console.log(message);
    if (!message.func === null)
    {
        message.func(message);
    }
    else{
        switch(message.req)
        {
            case "test":
                console.log(`Background script recieved message of type (test).`);
                sendRepsonse("Test message recieved. This is the response.");
                break;
            default:
                console.log(`Background script recieved message of type (${message.requestType}),`+
                            `which is not a recognized request.`);
                break;

        }
    }
    
});
