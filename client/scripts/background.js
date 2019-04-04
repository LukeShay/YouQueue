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
            case "playAudio":
                playAudio();
            default:
                console.log(`Background script recieved message of type (${message.requestType}),`+
                            `which is not a recognized request.`);
                break;

        }
    }
    
});


var playAudio = (mp3Path) =>
{
    if (mp3Path === "")
    {
        mp3Path = "../resources/Adele - Hello.mp3";
    }
    document.write(`<audio id="player" src="${mp3Path}" >`);
    document.getElementById('player').play();
}

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