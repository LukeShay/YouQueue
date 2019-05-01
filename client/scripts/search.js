var searchParams = {
  apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
  previousInput: null,
  currentInput: null,
  currentVideo: null
};

var curQueue = {};
var cur = "curQueueKey";
//var thumbnail = new Image();
var current = 0;

var addSearchListener = () => {
  var searchBar = document.getElementById("searchBox");
  searchBar.addEventListener("keyup", event => {
    if (event.key === "Enter") {
      parseSearchTempQueue(searchBar.value);
    }
  });
};

var parseSearchTempQueue = keyword => {
  var link = keyword.includes("www.youtube.com");
  if (link) {
    var split = keyword.split("=");
    APISearch(split[split.length - 1]);
  } else {
    APISearch(keyword);
  }
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
  var nextButton = document.getElementById("nextSong");
  nextButton.addEventListener("click", event => {
    var msg = new Message();
    msg.requestType = "nextSong";
    msg.data = "";
    msg.sendMessage();
    current ++;
    //displayThumbnail();
    //addCurrentQueueToHTML();
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
    obj.thumbURL = video.snippet.thumbnails.default.url;

    curQueue[Object.values(curQueue).length] = obj;

    document.getElementById("queue").innerHTML = "";

    chrome.storage.sync.set(curQueue, () => {
    });

    currentVideo = video.id.videoId;

    var msg = new Message();
    msg.requestType = Object.keys(curQueue).length == 0 ? "changeQueue" : "addToQueue";
    msg.data = currentVideo;
    msg.sendMessage();

    return currentVideo;
  };
};

var clearQueue = () =>{
  chrome.storage.sync.clear(()=>{
    console.log("Storage cleared.");
  }); 
  current = 0;
  document.getElementById("queue").innerHTML = "";
  document.getElementById("thumbImg").src = "";
  curQueue = {};
  var msg = new Message();
    msg.requestType = "clearedQueue";
    msg.data = currentVideo;
    msg.sendMessage();
};

var addCurrentQueueToHTML = () => {
  document.getElementById("queue").innerHTML = "";
  
  chrome.storage.sync.get(null, obj => {
    Object.values(obj).forEach((e, i) => {
      if (Object.keys(e)[0] != "thumbURL") {
        let ul = document.createElement("li");
        ul.id = "queueTitles";
        ul.innerText = "" + Object.values(e)[0];
        document.getElementById("queue").appendChild(ul);
        /* document.getElementById("queue").innerHTML += Object.values(e)[0] + "<br>"; */
      } else {
        let ul = document.createElement("li");
        ul.id = "queueTitles";
        ul.value = "" + Object.values(e)[0];
        document.getElementById("queue").appendChild(ul);
        /* document.getElementById("queue").innerHTML += Object.values(e)[1] + "<br>"; */
      }
    });
  });
};

chrome.storage.onChanged.addListener((changes, namespace)=> {
  changeThumbnail();
  addCurrentQueueToHTML();
});

var changeThumbnail = () => {
  chrome.storage.sync.get(null, obj => {
    document.getElementById("thumbImg").src = obj[0].thumbURL;
  });
};