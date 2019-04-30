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
    playerEvent();
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
            case "changeQueue":
                start = true;
                queueUpToDate = false;
                primaryPlayer.pause();
                songPlaying = false;
                songNum = 0;
                playerEvent();
                break;
            case "addToQueue":
                start = true;
                queueUpToDate = false;
                playerEvent();
                break;
            case "play":
                primaryPlayer.play();
                break;
            case "pause":
                primaryPlayer.pause();
                break;
            case "clearedQueue":
                primaryPlayer.pause();
                primaryPlayer.src = "";
                songPlaying = false;
                queueUpToDate = false;
                
                break;
            case "nextSong":
                primaryPlayer.onended();
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

var playerEvent = () =>
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
        console.log("song number:", songNum);
        if (queue[songNum] == undefined)
        {
            songNum = 0;
        }
        queueAudio(Object.keys(queue[songNum])[0]);
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
    console.log(queue);
    playerEvent();
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
        console.log("playing song:" + videoID);
        songNum++;
        
    }
}





