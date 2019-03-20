
var extInfo = {
  extensionOpened: false,
  currentUser: null,
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
  var txtEmail = document.getElementById("email");
    var txtPassword = document.getElementById("password");
    var btnLogin = document.getElementById("login");
    var btnSignup = document.getElementById("signup");
    var btnLogout = document.getElementById("logout");
  setPopupPage();
  initializeAuth();
}

var setPopupPage = () =>
{
  if (extInfo.currentUser != null)
  {

  }
  else
  {
    document.getElementById("loader").style.display = "none";
    document.getElementById("authForm").style.display = "block";
  }

  /* chrome.runtime.sendMessage({message: "hello"}, () =>{}); */
}




// Initialization Events/Actions:
/* console.log("background script running."); */


//-----Event listeners:
/* chrome.browserAction.setPopup({popup: "../html/popup.html"}, () => {}); */

//Popup window opened

