let user;
let uid;
let udb;

var authForm = document.getElementById("authForm");

var showSignIn = document.createElement("button");
showSignIn.id = "showSignIn";
showSignIn.innerHTML = "Sign In";
showSignIn.className = "button1";

var showSignUp = document.createElement("button");
showSignUp.id = "showSignUp";
showSignUp.innerHTML = "Sign Up";
showSignUp.className = "button2";

var txtName = document.createElement("input");
txtName.type = "text";
txtName.name = "name";
txtName.id = "name";
txtName.placeholder = "Name";
txtName.className = "txtIn";

var txtEmail = document.createElement("input");
txtEmail.type = "text";
txtEmail.name = "email";
txtEmail.id = "email";
txtEmail.placeholder = "Email";
txtEmail.className = "txtIn";

var txtPassword = document.createElement("input");
txtPassword.type = "password";
txtPassword.name = "password";
txtPassword.id = "password";
txtPassword.placeholder = "Password";
txtPassword.className = "txtIn";

var btnLogin = document.createElement("button");
btnLogin.id = "login";
btnLogin.innerHTML = "Log In";
btnLogin.className = "button1";

var btnSignup = document.createElement("button");
btnSignup.id = "signup";
btnSignup.innerHTML = "Sign Up";
btnSignup.className = "button1";

var btnLogout = document.createElement("button");
btnLogout.id = "logout";
btnLogout.innerHTML = "Log Out";
btnLogout.className = "logout"

var cancel = document.createElement("button");
cancel.id = "cancel";
cancel.innerHTML = "cancel";
cancel.className = "button2";


// Initialize Firebase
const config = {
    apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    authDomain: "youqueue-c89b9.firebaseapp.com",
    databaseURL: "https://youqueue-c89b9.firebaseio.com",
    projectId: "youqueue-c89b9",
    storageBucket: "youqueue-c89b9.appspot.com",
    messagingSenderId: "420416303698"
};
firebase.initializeApp(config);

let firestore = firebase.firestore();

showSignIn.addEventListener('click', e => {
    authForm.removeChild(showSignIn)
    authForm.removeChild(showSignUp);
    authForm.appendChild(txtEmail);
    authForm.appendChild(txtPassword);
    authForm.appendChild(btnLogin);
    authForm.appendChild(cancel);
});

showSignUp.addEventListener('click', e => {
    authForm.removeChild(showSignIn)
    authForm.removeChild(showSignUp);
    authForm.appendChild(txtName);
    authForm.appendChild(txtEmail);
    authForm.appendChild(txtPassword);
    authForm.appendChild(btnSignup);
    authForm.appendChild(cancel);
});

cancel.addEventListener('click', e => {
    removeForm();
    notLoggedIn();
});

// Add login event
btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
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

btnSignup.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    var e = emailCheck(email);
    var p = passwordCheck(pass);

    if (e && p) {

        // Sign up
        const promise = auth.createUserWithEmailAndPassword(email, pass);

        // Catches error
        promise.catch(e => {
            console.log(e.code + ": " + e.message);
        });

        const user = firebase.auth().currentUser

        user.updateProfile({displayName: txtName.value});

        console.log(user);

        //database.doc(auth.uid);

    } else if (!e && p) {
        document.getElementById("invalid").innerHTML = "Invalid email";

    } else if (!p && e) {
        document.getElementById("invalid").innerHTML = "Invalid password.<br>Must be 8 characters long<br>Must contain at least one letter and one number.";

    } else {
        document.getElementById("invalid").innerHTML = "Invalid email and password.<br>Password must be 8 characters long<br>Password must contain at least one letter and one number.";

    }
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
    document.getElementById("invalid").innerHTML = "";
});



// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    removeForm();
    if (firebaseUser) {
        console.log(firebaseUser);
        user = firebaseUser;
        uid = firebaseUser.uid;

        createUDB();
        loggedIn();

    } else {
        console.log("Not logged in");
        notLoggedIn();
    }
});

function removeForm() {
    if (document.getElementById("email")) authForm.removeChild(txtEmail);
    if (document.getElementById("password")) authForm.removeChild(txtPassword);
    if (document.getElementById("signup")) authForm.removeChild(btnSignup);
    if (document.getElementById("login")) authForm.removeChild(btnLogin);
    if (document.getElementById("cancel")) authForm.removeChild(cancel);
    if (document.getElementById("name")) authForm.removeChild(txtName);
    document.getElementById("invalid").innerHTML = "";
}

function notLoggedIn() {
    if (document.getElementById("logout")) authForm.removeChild(logout);
    authForm.appendChild(showSignIn);
    authForm.appendChild(showSignUp);
}

function loggedIn() {
    if (document.getElementById("showSignIn")) authForm.removeChild(showSignIn);
    if (document.getElementById("showSignUp")) authForm.removeChild(showSignUp);
    authForm.appendChild(btnLogout);
}

function emailCheck(email) {
    atSplit = email.split('@');
    if (atSplit.length == 2) {
        periodSplit = atSplit[1].split('.')
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

function createUDB() {
    firebase.firestore().doc(uid + "/blank").set({
        null: null
    });
    udb = firestore.collection(uid);
    console.log(udb);
}