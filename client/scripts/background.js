var start = false;
var songPlaying = false;
var queueUpToDate = false;
var queue = null;
var songNum = 0;

var primaryPlayer = document.createElement('video');
primaryPlayer.id = "primaryPlayer";

document.body.appendChild(primaryPlayer);

primaryPlayer.onended = () => {
    songPlaying = false;
    eventLoop();
};

chrome.runtime.onMessage.addListener((message, sender, sendRepsonse) =>
{
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
            case "overrideAudio":
                start = true;
                queueUpToDate = false;
                eventLoop();
                break;
            case "play":
                primaryPlayer.play();
                break;
            case "pause":
                primaryPlayer.pause();
                break;
            case "queueChange":
                break;
            default:
                console.log(`Background script recieved message of type (${message.requestType}),`+
                            `which is not a recognized request.`);
                break;
        }
    }
});

var eventLoop = () =>
{
    if (!queueUpToDate)
    {
        getQueue();
        return;
    }

    if (!start)
    {
        return;
    }
    else if (start && songPlaying)
    {
        return;
    }
    else if (start && !songPlaying)
    {
        if (queue[songNum] == undefined)
        {
            songNum = 0;
        }
        queueAudio(Object.keys(queue[songNum])[songNum]);
    }
}

var getQueue = () => {
    chrome.storage.sync.get(null, result =>{
        updateQueue(result);
    });
}

var updateQueue = (updatedQueue) => {
    queue = updatedQueue;
    queueUpToDate = true;
    eventLoop();
}


var queueAudio = (videoID) =>
{
    const vidReq = new XMLHttpRequest();
    vidReq.open("POST", `http://localhost:3000/`);
    vidReq.setRequestHeader('Content-Type', 'application/json');
    vidReq.send(JSON.stringify({
      ID: videoID
    }));

    vidReq.onload = e =>
    {
        setTimeout(() => {
            primaryPlayer.src = `http://localhost:3000/${videoID}.mp4`;
        }, 3000);

        primaryPlayer.oncanplaythrough = () => {primaryPlayer.play();}
        songPlaying = true;

        songNum++;
    }
    
}





