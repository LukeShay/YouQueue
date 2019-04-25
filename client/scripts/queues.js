const newQueueBtn = document.getElementById("newQueueBtn");
const editQueueBtn = document.getElementById("editQueueBtn");
const deleteQueueBtn = document.getElementById("deleteQueueBtn");
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
  newQueuePage();
});

videoSearch.addEventListener("keyup", e => {
  if (e.key == "Enter") {
    parseSearch(videoSearch.value);
  }
});

saveBtn.addEventListener("click", e => {
  var invalid = 0;

  if (queueName.value.trim().length != 0) {
    queueNames.forEach((value, index) => {
      if (queueName.value.trim() == value) {
        searchError.innerHTML = "Name in use.";
        console.log(value);
        invalid = 1;
      }
    });
  } else if (queueName.value.trim().length == 0) {
    earchError.innerHTML = "No name entered";
  } else if (Object.keys(tempQueue).length == 0) {
    searchError.innerHTML = "No songs in queue.";
  }

  if (!invalid) {
    newQueue(queueName.value.trim(), tempQueue);
    tempQueue = {};
    curNum = 0;

    queuePageHome();
  }
});

deleteQueueBtn.addEventListener("click", e => {
  addQueuesToHTML(1);
});

/**
 * Fetches queues from firebase and adds them to the "curText" div in the queueContainer.
 * @var func - 0 for playing, 1 for deleting, and 2 for editing.
 */
var addQueuesToHTML = func => {
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
          if (func == 0) {
            addQueueToStorage(button.value);
          } else if (func == 1) {
            deleteQueueFromFirestore(button.value);
          } else if (func == 2) {
          }
        });

        docFrag.appendChild(button);
        docFrag.appendChild(br);
      });

      if (func == 0) {
        searchError.innerHTML = "Click on queue to play.";
      } else if (func == 1) {
        searchError.innerHTML = "Click on queue to delete.";
      } else if (func == 2) {
        searchError.innerHTML = "Click on queue to edit.";
      }

      curText.innerHTML = "";
      curText.appendChild(docFrag);
    });
};

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
  document.getElementById("queueContainer").style.gridTemplateRows =
    "20px 25px auto auto";
  document.getElementById("queueContainer").style.gridTemplateColumns =
    "133px 133px 133px";
  newQueueBtn.style.display = "block";
  editQueueBtn.style.display = "block";
  deleteQueueBtn.style.display = "block";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  undoBtn.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.style.gridRow = "4";

  addQueuesToHTML(0);
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

var newQueuePage = () => {
  document.getElementById("queueContainer").style.gridTemplateRows =
    "20px 25px 25px 20px 215px 20px";
  document.getElementById("queueContainer").style.gridTemplateColumns = "auto";
  newQueueBtn.style.display = "none";
  editQueueBtn.style.display = "none";
  deleteQueueBtn.style.display = "none";
  queueName.style.display = "block";
  videoSearch.style.display = "block";
  undoBtn.style.display = "none";
  saveBtn.style.display = "block";
  curText.innerHTML = "";
  searchError.innerHTML = "Click on song to delete.";
  curText.style.gridRow = "5";
};

var deleteQueueFromFirestore = (queueName) => {
  deleteQueue(queueName);
  addQueuesToHTML(1);
}