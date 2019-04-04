var currentPlayer = document.createElement('video');
currentPlayer.id = "currentPlayer";

var queuedPlayer = document.createElement('video');
queuedPlayer.id = "queuedPlayer";

document.body.appendChild(currentPlayer);
document.body.appendChild(queuedPlayer);

console.log(currentPlayer.src);



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
            case "fetchAudio":
                /* queueAudio(message.data, "current"); */
                break;
            default:
                console.log(`Background script recieved message of type (${message.requestType}),`+
                            `which is not a recognized request.`);
                break;

        }
    }
    
});

var queueAudio = (videoID, option) =>
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
            if (option === "current")
            {
                currentPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            if (option === "queued")
            {
                queuedPlayer.src = `http://localhost:3000/${videoID}.mp4`;
            }
            
        }, 2000);
    }
}


var manageQueue = () =>
{
    if (currentPlayer.src == "")
    {
        queueAudio("Q9hLcRU5wE4", "current");
        currentPlayer.play();
    }
    else if (currentPlayer.paused)
    {
        currentPlayer.play();
    }
}

/* manageQueue(); */




var nextSong = () => {
  var next = {};
  var queue = {};
  var lastSongIndex;

  chrome.storage.sync.get(null, result =>{
    queue = result;
  });

  lastSongIndex = Object.keys(queue).length - 1;

  next = Object.shift(obj);
  console.log(next);

  chrome.storage.sync.set(queue, () => {
    console.log("Storage has been set to: ", queue);
  })

  chrome.storage.sync.remove([lastSongIndex + ""]);

  return next;
}

Object.shift = (obj) => {
  var ret = obj[0];

  for(var i = 1; i < Object.keys(obj).length; i++){
    obj[i-1] = obj[i];
  }
  obj[i] = null;

  return ret;
}

