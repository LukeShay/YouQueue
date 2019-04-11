var currentPlayer = 1;
var songQueued = false;
var songPlaying = false;

var primaryPlayer = document.createElement('video');
primaryPlayer.id = "primaryPlayer";

var secondaryPlayer = document.createElement('video');
secondaryPlayer.id = "secondaryPlayer";

document.body.appendChild(primaryPlayer);
document.body.appendChild(secondaryPlayer);

primaryPlayer.onended = () => {
    songPlaying = false;
    if (songQueued) 
    {
        secondaryPlayer.oncanplaythrough = () => {secondaryPlayer.play();};
        songQueued = false;
    }
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
                overrideAudio(message.data);
                break;
            case "play":
                primaryPlayer.play();
                break;
            case "pause":
                primaryPlayer.pause();
                break;
            case "clearedQueue":
                primaryPlayer.pause();
                //primaryPlayer = null;
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

var overrideAudio = (id) =>
{
    if (songPlaying){
        queueAudio(id, 2);
        songQueued = true;
    }
    else{
        console.log("playing:" + id);
        queueAudio(id, 1);
        primaryPlayer.oncanplaythrough = () => {primaryPlayer.play();}
        songPlaying = true;
    }
    
}

var queueAudio = (videoID, playerNum) =>
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
            if (playerNum == 1)
            {
                primaryPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            if (playerNum == 2)
            {
                secondaryPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            
        }, 3000);
    }
}


var nextSong = () => {
    var next = {};
    var queue = {};
    var lastSongIndex;
  
    chrome.storage.sync.get(null, result =>{
      queue = result;
    });

    var nextSong = setTimeout(() => {
        lastSongIndex = Object.keys(queue).length - 1;

    if (songPlaying)
    {
        next = Object.shift(queue);
    }
    else{
        next = queue[0];
    }
    chrome.storage.sync.remove([lastSongIndex + ""]);
    return next;
    }, 3000);

  }
  
  Object.shift = (obj) => {
    var ret = obj[0];
  
    for(var i = 1; i < Object.keys(obj).length; i++){
      obj[i-1] = obj[i];
    }
    obj[i] = null;
  
    return ret;
  }


var managePlayer = () =>
{
    if (songPlaying === false && songQueued === false)
    {
        if (nextSong())
        {
            console.log("queueing audio");
            queueAudio(nextSong());
        }
    }
    /* if (currentPlayer.src == "")
    {
        queueAudio("LbrvCyEoW0Q", "current");
        currentPlayer.oncanplaythrough = () => {currentPlayer.play()};
    } */
    /* else if (currentPlayer.paused)
    {
        currentPlayer.play();
    } */
}


managePlayer();




