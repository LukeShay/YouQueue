var searchParams = {
  apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
  previousInput: null,
  currentInput: null,
  currentVideo: null
};

const queueJSONPath = "../resources/curQueue.json";
var curQueue = {};

var addSearchListener = () => {
  var searchBar = document.getElementById("searchBox");
  searchBar.addEventListener("keyup", event => {
    if (event.key === "Enter") {
      APISearch(searchBar.value);
    }
  });
};

var APISearch = searchTerm => {
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
    var video = Http.response.items[2];
    var videoID = video.id.videoId;

    curQueue[video.id.videoId] = video.snippet.title;
    /* saveJSON(curQueue, queueJSONPath); */

    document.getElementById("queue").innerHTML = "";

    Object.values(curQueue).forEach((value, index)=>{
      document.getElementById("queue").innerHTML += value + "<br>";
    });

    currentVideo = video.id.videoId;

    var msg = new Message("test", "test data", (response)=>{console.log(response);});
    msg.sendMessage();
  };
};
