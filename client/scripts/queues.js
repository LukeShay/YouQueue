const newQueueBtn = document.getElementById("newQueueBtn");
const editQueueBtn = document.getElementById("editQueueBtn");
const deleteQueueBtn = document.getElementById("deleteQueueBtn");
const queueName = document.getElementById("queueName");
const videoSearch = document.getElementById("videoSearch");
const saveBtn = document.getElementById("save");
const cancelBtn = document.getElementById("cancelQueueBtn");
const curText = document.getElementById("curText");
const searchError = document.getElementById("searchError");

const PLAY = 0;
const DELETE = 1;
const EDIT = 2;

var edditingQueue = false;
var nameOfQueueBeingEdited = "";

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
  var name;

  if (Object.keys(tempQueue).length == 0) {
    searchError.innerHTML = "No songs in queue.";
    invalid = 1;
  } else if (edditingQueue) {
    name = nameOfQueueBeingEdited;
    edditingQueue = false;


  }else if (queueName.value.trim().length != 0) {
    queueNames.forEach((value, index) => {
      if (queueName.value.trim() == value) {
        searchError.innerHTML = "Name in use.";
        invalid = 1;
      }
    });
  } else if (queueName.value.trim().length == 0) {
    searchError.innerHTML = "No name entered";
    invalid = 1;
  } else {
    name = queueName.value.trim();
  }

  if (!invalid) {
    newQueue(name, tempQueue);
    tempQueue = {};
    curNum = 0;

    queuePageHome();
  }
});

deleteQueueBtn.addEventListener("click", e => {
  addQueuesToHTML(DELETE);
  cancelQueueBtn.style.display = "block";
});

editQueueBtn.addEventListener("click", e => {
  addQueuesToHTML(EDIT);
});

cancelQueueBtn.addEventListener("click", e=> {
  queuePageHome();
});

/**
 * Fetches queues from firebase and adds them to the "curText" div in the queueContainer.
 * @var func - Action
 */
var addQueuesToHTML = func => {
  var docFrag = document.createDocumentFragment();
  queueNames = [];

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
          if (func == PLAY) {
            addQueueToStorage(button.value);
          } else if (func == DELETE) {
            deleteQueueFromFirestore(button.value);
          } else if (func == EDIT) {
            editQueueFromFirestore(button.value);
          }
        });

        docFrag.appendChild(button);
        docFrag.appendChild(br);
      });

      if (func == PLAY) {
        searchError.innerHTML = "Click on queue to play.";
      } else if (func == DELETE) {
        searchError.innerHTML = "Click on queue to delete.";
      } else if (func == EDIT) {
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

    curText.appendChild(button);
    curText.appendChild(br);

    curNum++;
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
    "1px 30px auto auto";
  newQueueBtn.style.display = "block";
  editQueueBtn.style.display = "block";
  deleteQueueBtn.style.display = "block";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.style.gridRow = "4";
  cancelBtn.style.display = "none";

  addQueuesToHTML(PLAY);
};

var queuePageNotLoggedIn = () => {
  newQueueBtn.style.display = "none";
  deleteQueueBtn.style.display = "none";
  editQueueBtn.style.display = "none";
  queueName.style.display = "none";
  videoSearch.style.display = "none";
  saveBtn.style.display = "none";
  curText.innerHTML = "";
  searchError.innerHTML = "You are not logged in.";
};

var newQueuePage = () => {
  document.getElementById("queueContainer").style.gridTemplateRows =
    "0px 25px 25px 20px 195px 22px 20px";
  newQueueBtn.style.display = "none";
  editQueueBtn.style.display = "none";
  deleteQueueBtn.style.display = "none";
  cancelBtn.style.display = "block";
  queueName.style.display = "block";
  videoSearch.style.display = "block";
  saveBtn.style.display = "block";
  curText.innerHTML = "";
  searchError.innerHTML = "Click on song to delete.";
  curText.style.gridRow = "5";
  curText.style.height = "195px";

  if (edditingQueue) {
    queueName.style.display = "none";
  }
};

var deleteQueueFromFirestore = queueName => {
  deleteQueue(queueName);
  addQueuesToHTML(DELETE);
};

var editQueueFromFirestore = queueName => {
  curNum = 0;
  curText.innerHTML = "";
  edditingQueue = true;
  nameOfQueueBeingEdited = queueName;

  newQueuePage();

  udb
    .doc(queueName)
    .get()
    .then(snapshot => {
      
      tempQueue = snapshot.data();
      delete tempQueue.valid;

      Object.values(tempQueue).forEach((obj, index) => {
        var button = document.createElement("button");
        var br = document.createElement("br");
        button.setAttribute("id", curNum);
        button.setAttribute("class", "videoNameBtn");
        button.innerHTML = Object.values(obj);
    
        button.addEventListener("click", e => {
          button.parentNode.removeChild(button);
          br.parentNode.removeChild(br);
          removeNum(tempQueue, parseInt(button.id));
          curNum--;
        });
        
        curText.appendChild(button);
        curText.appendChild(br);
        curNum ++;
      });
    });
};