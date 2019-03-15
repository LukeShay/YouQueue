var firebase = require('firebase');
var firebaseui = require('firebaseui');


var config = {
    apiKey: "AIzaSyANwnyx73Wn1Fvp_YAgCOwyuLRx3I6CRco",
    authDomain: "youqueue-adcd6.firebaseapp.com",
    databaseURL: "https://youqueue-adcd6.firebaseio.com",
    projectId: "youqueue-adcd6",
    storageBucket: "youqueue-adcd6.appspot.com",
    messagingSenderId: "1004653711929"
  };

  var provider = new firebase.auth.GoogleAuthProvider();

  function login() {
    firebase.auth().signInWithRedirect(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  })};