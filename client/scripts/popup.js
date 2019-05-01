var extInfo = {
  currentUser: null,
  containers: ["searchContainer", "authContainer", "queueContainer"],
  config: {
    apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    authDomain: "youqueue-c89b9.firebaseapp.com",
    databaseURL: "https://youqueue-c89b9.firebaseio.com",
    projectId: "youqueue-c89b9",
    storageBucket: "youqueue-c89b9.appspot.com",
    messagingSenderId: "420416303698"
  }
};

firebase.initializeApp(extInfo.config);
extInfo.currentUser = firebase.auth().currentUser;

window.onload = () => {
  addSearchListener();
  PauseListener();
  PlayListener();
  ClearQueueListener();
  NextSongListener();
  addQueueToSearch();
  setContainer();
  addNavListeners();
  addCurrentQueueToHTML();
  changeThumbnail();
};

var addNavListeners = () =>
{
  document.getElementById("searchNav").addEventListener("click", e =>
  {
    loadContainer("searchContainer");
  });

  document.getElementById("loginNav").addEventListener("click", e =>
  {
    loadContainer("authContainer");
  });

  document.getElementById("queueNav").addEventListener("click", e =>
  {
    loadContainer("queueContainer");
  });

  document.getElementById("checkbox").addEventListener("click", e =>
  {
    
  });



}


var setContainer = () => {
  if (!extInfo.currentUser) {
    loadContainer("searchContainer");
  } else {
    loadContainer("authContainer"); 
  }
};



var loadContainer = selectedContainer => {
  extInfo.containers.forEach(element => {
    if (element != selectedContainer) {
      document.getElementById(element).style.display = "none";
    } else {
      document.getElementById(element).style.display = "grid";
    }
  });
};

var addQueueToSearch = () => {
  chrome.storage.sync.get(null, result => {
    Object.values(result).forEach((obj, index) => {
      document.getElementById("thumbnail").appendChild()
      document.getElementById("queue").innerHTML += Object.values(obj)[0] + "<br>";
    });
  });
};