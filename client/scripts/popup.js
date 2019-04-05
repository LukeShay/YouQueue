var extInfo = {
  currentUser: null,
  containers: ["searchContainer", "splashContainer", "authContainer"],
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
  loadContainer("searchContainer");
  addSearchListener();
  addQueueToSearch();
  document.getElementById("containerSelector").style.display = "grid";
};

/* var cSelect = document.getElementById('containerSelect');
cSelect.addEventListener('change', function() {
  if(cSelect.value == "authContainer")
    {
      setContainer("authContainer");
    }
    if(cSelect.value == "searchContainer")
    {
    	setContainer("searchContainer");
    }

    console.log(cSelect.value);
}, false); */

/* Main view controller:
  - View prcedence 
    1. Sign-Up/Sign-In Page
      -> based on user authentication status
    2. User application page
      -> includes search elements
      -> includes active playlist
      -> includes logout element
    3. User settings page?
*/
var setContainer = () => {
  if (!extInfo.currentUser) {
    loadContainer("searchContainer");
    /* Check user data
        - Has active/favorited/recent/saved playlist?
          - Show active/favorited/recent/saved playlist
          - Show search elements
          - Show logout button
        - Else:
          - Show search elements
          - Show create playlist
          - SHow logout button
    */
  } else {
    // Show login page
    loadContainer("searchContainer"); //<----Change this manually during development to change the container shown (unless you're logged in)
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
      document.getElementById("queue").innerHTML += Object.values(obj) + "<br>";
    });
  });
};

//-----Functions
