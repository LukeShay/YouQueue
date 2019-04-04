var name;
var uid;
var udb;
var queues = {};

const elements = [
  "name",
  "password",
  "email",
  "showSignUp",
  "showSignIn",
  "login",
  "signup",
  "logout",
  "cancel",
  "msg"
];

var firestore = firebase.firestore();

document.getElementById("showSignIn").addEventListener("click", e => {
  showSignIn();
});

document.getElementById("showSignUp").addEventListener("click", e => {
  showSignUp();
});

document.getElementById("cancel").addEventListener("click", e => {
  notLoggedIn();
});

// Add login event
document.getElementById("login").addEventListener("click", e => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const auth = firebase.auth();

  // Sign in
  const promise = auth.signInWithEmailAndPassword(email, pass);

  // Catches error
  promise.catch(e => {
    console.log(e.code + ": " + e.message);

    if (e.code === "auth/user-not-found") {
      document.getElementById("invalid").innerHTML = "User not found";
    } else if (e.code === "auth/wrong-password") {
      var s;
      if (passwordCheck(pass)) {
        s = "Invalid password";
      } else {
        s = "Wrong password";
      }
      document.getElementById("invalid").innerHTML = s;
    } else if (e.code === "auth/invalid-email") {
      document.getElementById("invalid").innerHTML = "Invalid email";
    } else {
      document.getElementById("invalid").innerHTML = "Error";
    }
  });
});

document.getElementById("signup").addEventListener("click", e => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const auth = firebase.auth();

  var e = emailCheck(email);
  var p = passwordCheck(pass);

  if (e && p) {
    const promise = auth
      .createUserWithEmailAndPassword(email, pass)
      .then(user => {
        user.updateProfile({
          displayName: name
        });
        console.log(user.displayName);
      })
      .catch(e => {
        console.log(e.code + ": " + e.message);
      });
  } else if (!e && p) {
    document.getElementById("msg").innerHTML = "Invalid email";
  } else if (!p && e) {
    document.getElementById("msg").innerHTML =
      "<li>Invalid password.</li>" +
      "<li>Must be 8 characters long.</li>" +
      "<li>Must contain at least one letter and one number.</li>";
  } else {
    document.getElementById("msg").innerHTML =
      "<li>Invalid email and password.</li>" +
      "<li>Password must be 8 characters long.</li>" +
      "<li>Password must contain at least one letter and one number.</li>";
  }
});

document.getElementById("logout").addEventListener("click", e => {
  firebase.auth().signOut();
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log("Logged in");
    user = firebaseUser;
    uid = firebaseUser.uid;

    createUDB();
    loggedIn();

/*     newQueue("queue1", {
      0: { videoID: "title" },
      1: { videoID: "title" },
      2: { videoID: "title" }
    });
    newQueue("queue2", {});
    newQueue("queue3", {});

    getNamesOfQueues(); */

  } else {
    console.log("Not logged in");
    notLoggedIn();
  }
});

function notLoggedIn() {
  clearContainer();

  document.getElementById("showSignIn").style.display = "block";
  document.getElementById("showSignUp").style.display = "block";
}

function loggedIn() {
  clearContainer();

  document.getElementById("logout").innerHTML = "Log Out"; // " + firebase.auth().currentUser.displayName;
  document.getElementById("logout").style.display = "block";
}

function showSignIn() {
  clearContainer();

  document.getElementById("email").style.display = "block";
  document.getElementById("password").style.display = "block";
  document.getElementById("login").style.display = "block";
  document.getElementById("cancel").style.display = "block";
  document.getElementById("msg").style.display = "block";
}

function showSignUp() {
  clearContainer();

  document.getElementById("name").style.display = "block";
  document.getElementById("email").style.display = "block";
  document.getElementById("password").style.display = "block";
  document.getElementById("signup").style.display = "block";
  document.getElementById("cancel").style.display = "block";
  document.getElementById("msg").style.display = "block";
}

function clearContainer() {
  elements.forEach(el => {
    document.getElementById(el).style.display = "none";

    if (el == "msg") {
      document.getElementById(el).innerHTML = "";
    }
  });
}

function emailCheck(email) {
  atSplit = email.split("@");
  if (atSplit.length == 2) {
    periodSplit = atSplit[1].split(".");
    if (periodSplit.length == 2) {
      return true;
    }
  }
  return false;
}

function passwordCheck(entry) {
  if (entry.length < 8 || alphaCheck(entry) || numCheck(entry)) {
    return false;
  } else {
    return true;
  }
}

function alphaCheck(entry) {
  let regex = /^[a-z]+$/i;
  if (entry != null && entry.match(regex)) {
    return true;
  } else {
    return false;
  }
}

function numCheck(entry) {
  let regex = /^[0-9]+$/i;
  if (entry != null && entry.match(regex)) {
    return true;
  } else {
    return false;
  }
}
