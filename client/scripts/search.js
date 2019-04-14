

var searchParams = {
  apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
  previousInput: null,
  currentInput: null,
  currentVideo: null
};

var curQueue = {};
var cur = "curQueueKey";


var addSearchListener = () => {
  var searchBar = document.getElementById("searchBox");
  searchBar.addEventListener("keyup", event => {
    if (event.key === "Enter") {
      APISearch(searchBar.value);
    }
  });
};


var ClearQueueListener = () => {
  var clearButton = document.getElementById("clearQueue");
  clearButton.addEventListener("click", event => {
    clearQueue();
  });
};

var PlayListener = () => {
  var playButton = document.getElementById("play");
  playButton.addEventListener("click", event => {
    var msg = new Message();
    msg.requestType = "play";
    msg.data = "";
    msg.sendMessage();
  });
};

var NextSongListener = () => {
  var playButton = document.getElementById("nextSong");
  playButton.addEventListener("click", event => {
    var msg = new Message();
    msg.requestType = "nextSong";
    msg.data = "";
    msg.sendMessage();
  });
};

var PauseListener = () => {
  var pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", event => {
    var msg = new Message();
    msg.requestType = "pause";
    msg.data = "";
    msg.sendMessage();  
  });
};

var APISearch = searchTerm => {
  chrome.storage.sync.get(null, result => {
    curQueue = result;
  });
  console.log(curQueue);

  const Http = new XMLHttpRequest();
  const url =
    "https://www.googleapis.com/youtube/v3/search?" +
    "part=snippet" +
    "&max-results=1" +
    `&q=${searchTerm}` +
    "&order=viewCount" +
    "&type=video" +
    "&videoDefinition=high" +
    `&key=${searchParams.apiKey}`;

  Http.responseType = "json";
  Http.open("GET", url, true);
  Http.send();
  Http.onload = e => {
    var video = Http.response.items[0];
    var videoID = video.id.videoId;

    var obj = {};

    obj[videoID] = video.snippet.title;
    curQueue[Object.values(curQueue).length] = obj;

    document.getElementById("queue").innerHTML = "";

    Object.values(curQueue).forEach((obj, index) => {
      document.getElementById("queue").innerHTML += Object.values(obj) + "<br>";
    });

    chrome.storage.sync.set(curQueue, () => {
      console.log("Storage has been set to: ", curQueue);
    });

    currentVideo = video.id.videoId;
    //console.log(currentVideo);

    var msg = new Message();
    msg.requestType = "changeQueue";
    msg.data = currentVideo;
    msg.sendMessage();

    return currentVideo;
  };
};

var clearQueue = () =>{
  chrome.storage.sync.clear(()=>{
    console.log("Storage cleared.");
  }); 
  document.getElementById("queue").innerHTML = "";
  curQueue = {};
  var msg = new Message();
    msg.requestType = "clearedQueue";
    msg.data = currentVideo;
    msg.sendMessage();
}

