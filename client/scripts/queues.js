const newQueueBtn = document.getElementById("newQueueBtn");
const queueName = document.getElementById("queueName");
const videoSearch = document.getElementById("videoSearch");
const undoBtn = document.getElementById("undo");
const saveBtn = document.getElementById("save");
const curText = document.getElementById("curText");
const searchError = document.getElementById("searchError");

var tempQueue = {};
var curNum = 1;

newQueueBtn.style.display = "block";
queueName.style.display = "none";
videoSearch.style.display = "none";
undoBtn.style.display = "none";
saveBtn.style.display = "none";
curText.innerHTML = "";
searchError.innerHTML = "";

newQueueBtn.addEventListener("click", e => {
  newQueueBtn.style.display = "none";
  queueName.style.display = "block";
  videoSearch.style.display = "block";
  undoBtn.style.display = "block";
  saveBtn.style.display = "block";
  curText.innerHTML = "";
  searchError.innerHTML = "";
});

videoSearch.addEventListener("keyup", e => {
  if (e.key == "Enter") {
    parseSearch(videoSearch.value);
  }
});

saveBtn.addEventListener("click", e => {
  newQueue(queueName.value, tempQueue);
  tempQueue = {};
  curNum = 1;

  newQueueBtn.style.display = "block";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  undoBtn.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.innerHTML = "";

  addQueuesToHTML();
});

/**
 * Fetches queues from firebase and adds them to the "curText" div in the queueContainer.
 */
var addQueuesToHTML = () => {
  firebase
    .firestore()
    .collection(uid)
    .where("valid", "==", true)
    .get()
    .then(querySnap => {
      querySnap.forEach(doc => {
        curText.innerHTML += doc.id + "<br>";
        console.log(doc.id);
      });
    });
};

var parseSearch = keyword => {
  var link = keyword.includes("www.youtube.com");
  if (link) {
    var splitteroni = keyword.split("=");
    runSearch(splitteroni[1]);
  } else {
    runSearch(keyword);
  }
};

var runSearch = keyword => {
  const Http = new XMLHttpRequest();
  const url =
    "https://www.googleapis.com/youtube/v3/search?" +
    "part=snippet" +
    "&max-results=1" +
    `&q=${keyword}` +
    "&order=viewCount" +
    "&type=video" +
    "&videoDefinition=high" +
    `&key=${searchParams.apiKey}`;

  Http.responseType = "json";
  Http.open("GET", url, true);
  Http.send();
  Http.onload = e => {
    var video = Http.response.items[0];
    var tempObj = {};
    tempObj[video.id.videoId] = video.snippet.title;

    tempQueue[curNum] = tempObj;

    curText.innerHTML += video.snippet.title + "<br>";

    curNum++;
    console.log(tempQueue);
  };
};
