var searchParams = {
  apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
  previousInput: null,
  currentInput: null,
  currentVideo: null
};

var cur = "curQueueKey";

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
  const Http = new XMLHttpRequest();
  const url =
    "https://www.googleapis.com/youtube/v3/search?" +
    "part=snippet" +
    "&max-results=1" +
    `&q=${searchTerm}` +
    "&order=relevance" +
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

    chrome.storage.sync.set(curQueue, () => {});

    currentVideo = video.id.videoId;

    var msg = new Message();
    msg.requestType =
      Object.keys(curQueue).length == 0 ? "changeQueue" : "addToQueue";
    msg.data = currentVideo;
    msg.sendMessage();

    return currentVideo;
  };
};

var clearQueue = () => {
  chrome.storage.sync.clear(() => {
    curQueue = {};

    var msg = new Message();
    msg.requestType = "clearedQueue";
    msg.data = currentVideo;
    msg.sendMessage();
    
    currentVideo = null;
  });
};

var addCurrentQueueToHTML = () => {
  document.getElementById("queue").innerHTML = "";

  chrome.storage.sync.get(null, obj => {
    Object.values(obj).forEach((e, i) => {
      let ul = document.createElement("li");
      ul.id = "queueTitles";

      if (Object.keys(e)[0] != "thumbURL") {
        ul.innerText = "" + Object.values(e)[0];
      } else {
        ul.innerText = "" + Object.values(e)[1];
      }

      document.getElementById("queue").appendChild(ul);
    });
  });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  changeThumbnail();
  addCurrentQueueToHTML();
});

var changeThumbnail = () => {
  chrome.storage.sync.get(null, obj => {
    if (Object.values(obj).length == 0) {
      document.getElementById("thumbImg").src = "";
    }
    document.getElementById("thumbImg").src = obj[0].thumbURL;
  });
};
