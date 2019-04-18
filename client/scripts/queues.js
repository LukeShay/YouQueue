const newQueueBtn = document.getElementById("newQueueBtn");
const queueName = document.getElementById("queueName");
const videoSearch = document.getElementById("videoSearch");
const undoBtn = document.getElementById("undo");
const saveBtn = document.getElementById("save");
const curText = document.getElementById("curText");
const searchError = document.getElementById("searchError");

var tempQueue = {};
var queueNames = [];
var curNum = 0;

newQueueBtn.addEventListener("click", e => {
  document.getElementById("queueContainer").style.gridTemplateRows =
    "20px 25px 25px 20px 250px 20px";
  newQueueBtn.style.display = "none";
  queueName.style.display = "block";
  videoSearch.style.display = "block";
  undoBtn.style.display = "none";
  saveBtn.style.display = "block";
  curText.innerHTML = "";
  searchError.innerHTML = "Click on song to delete.";
  curText.style.gridRow = "5";
});

videoSearch.addEventListener("keyup", e => {
  if (e.key == "Enter") {
    parseSearch(videoSearch.value);
  }
});

saveBtn.addEventListener("click", e => {
  var invalid = 0;
  queueNames.forEach((value, index) => {
    if (queueName.value == value) {
      searchError.innerHTML = "Name in use.";
      console.log(value);
      invalid = 1;
    }
  });

  if (!invalid) {
    newQueue(queueName.value, tempQueue);
    tempQueue = {};
    curNum = 0;

    queuePageHome();
  }
});

/**
 * Fetches queues from firebase and adds them to the "curText" div in the queueContainer.
 */
var addQueuesToHTML = () => {
  var docFrag = document.createDocumentFragment();

  firebase
    .firestore()
    .collection(uid)
    .where("valid", "==", true)
    .get()
    .then(querySnap => {
      querySnap.forEach(doc => {
        var button = document.createElement("button");
        var br = document.createElement("br");
        button.setAttribute("id", "queueNameBtn");
        button.setAttribute("value", doc.id);
        button.innerHTML = doc.id;

        queueNames.push(doc.id);

        button.addEventListener("click", e => {
          addQueueToStorage(button.value);
        });

        docFrag.appendChild(button);
        docFrag.appendChild(br);
      });
      document.getElementById("curText").appendChild(docFrag);
    });
};

// var addQueueNameBtnListener = () =>{
//   document.getElementById("queueNameBtn").addEventListener("click", e => {
//     addQueueToStorage(this.value);
//   });
// };

var parseSearch = keyword => {
  var link = keyword.includes("www.youtube.com");
  if (link) {
    var split = keyword.split("=");
    runSearch(split[split.length - 1]);
  } else {
    runSearch(keyword);
  }
};

var runSearch = keyword => {
  var docFrag = document.createDocumentFragment();
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

    var button = document.createElement("button");
    var br = document.createElement("br");
    button.setAttribute("id", curNum);
    button.setAttribute("class", "videoNameBtn");
    button.innerHTML = video.snippet.title;

    button.addEventListener("click", e => {
      button.parentNode.removeChild(button);
      br.parentNode.removeChild(br);
      removeNum(tempQueue, parseInt(button.id));
      curNum--;
    });

    document.getElementById("curText").appendChild(button);
    document.getElementById("curText").appendChild(br);

    curNum++;
    console.log(tempQueue);
  };
};

var removeNum = (object, index) => {
  var i;
  for (i = index; i < curNum - 2; i++) {
    object[i] = object[i + 1];
  }
  delete object[i + 1];
};

var queuePageHome = () => {
  document.getElementById("queueContainer").style.gridTemplateRows = "20px 25px auto auto"
  newQueueBtn.style.display = "block";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  undoBtn.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.style.gridRow = "4"
  searchError.innerHTML = "Click on queue to play.";

  addQueuesToHTML();
};

var queuePageNotLoggedIn = () => {
  newQueueBtn.style.display = "none";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  undoBtn.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.innerHTML = "You are not logged in.";
};
