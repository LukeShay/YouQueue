
var extInfo = {
  extensionOpened: false,
  currentUser: null,
  containers: [
    "searchContainer",
    "splashContainer"
  ],
  config: {
    apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    authDomain: "youqueue-c89b9.firebaseapp.com",
    databaseURL: "https://youqueue-c89b9.firebaseio.com",
    projectId: "youqueue-c89b9",
    storageBucket: "youqueue-c89b9.appspot.com",
    messagingSenderId: "420416303698"
  }
}

firebase.initializeApp(extInfo.config);
extInfo.currentUser = firebase.auth().currentUser;

window.onload = () => 
{
  setContainer();
}

var setContainer = () =>
{
  if (extInfo.currentUser != null)
  {

  }
  else
  {
    /* loadContainer("searchContainer"); */
  }
}

var loadContainer = (selectedContainer) =>
{
  extInfo.containers.forEach(element => {
    if (element != selectedContainer)
    {
      document.getElementById(element).style.display = "none";
    }
    else
    {
      document.getElementById(element).style.display = "block";

    }
  });
}






//-----Functions


