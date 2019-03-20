var uid;
var udb;
var authElements = {
    txtEmail: null,
    txtPassword: null,
    btnLogin: null,
    btnSignup: null,
    btnLogout: null
}

// Initialize Firebase
/* const config = {
    apiKey: "AIzaSyCwvG2g1PJZeAMtiR1qKA9xG8SJhMKWgRg",
    authDomain: "youqueue-c89b9.firebaseapp.com",
    databaseURL: "https://youqueue-c89b9.firebaseio.com",
    projectId: "youqueue-c89b9",
    storageBucket: "youqueue-c89b9.appspot.com",
    messagingSenderId: "420416303698"
};
firebase.initializeApp(config); */

const firestore = firebase.firestore();

// Get elements


// Add login event
var initializeAuth = () =>
{
    setElements();
    addLoginListener();
    addSignupListener();
    addLogoutListener();
    addRealtimeListener();
}

var setElements = () =>
{
    authElements.txtEmail = document.getElementById("email");
    authElements.txtPassword = document.getElementById("password");
    authElements.btnLogin = document.getElementById("login");
    authElements.btnSignup = document.getElementById("signup");
    authElements.btnLogout = document.getElementById("logout");
}
    
var addLoginListener = () =>
{
    console.log(authElements.btnLogin);
    authElements.btnLogin.addEventListener('click', e => {
        const email = authElements.txtEmail.value;
        const pass = authElements.txtPassword.value;
        const auth = firebase.auth();

        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);

        // Catches error
        promise.catch(e => {
            console.log(e.code + ": " + e.message);
            console.log(typeof e.code);
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
}

var addSignupListener = () =>
{
    authElements.btnSignup.addEventListener('click', e => {
        const email = authElements.txtEmail.value;
        const pass = authElements.txtPassword.value;
        const auth = firebase.auth();

        var e = emailCheck(email);
        var p = passwordCheck(pass);

        if (e && p) {
            var err;

            // Sign up
            const promise = auth.createUserWithEmailAndPassword(email, pass);

            // Catches error
            promise.catch(e => {
                console.log(e.code + ": " + e.message);
            });

            console.log(firebase.auth().currentUser);

            //database.doc(auth.uid);

        } else if (!e && p) {
            document.getElementById("invalid").innerHTML = "Invalid email";

        } else if (!p && e) {
            document.getElementById("invalid").innerHTML = "Invalid password.<br>Must be 8 characters long<br>Must contain at least one letter and one number.";

        } else {
            document.getElementById("invalid").innerHTML = "Invalid email and password.<br>Password must be 8 characters long<br>Password must contain at least one letter and one number.";

        }
    });
}

var addLogoutListener = () =>
{
    authElements.btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
        document.getElementById("invalid").innerHTML = "";
    });
}

var addRealtimeListener = () =>
{
    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            uid = firebaseUser.uid;
            console.log(uid);
            firestore.doc(uid + "/blank").set({null:null});
            udb = firestore.collection(uid);
            console.log(udb);
            
            if (document.getElementById("logout").style.visibility == "hidden") {
                document.getElementById("logout").style.visibility = "visible";
                document.getElementById("invalid").innerHTML = "";
            }
        } else {
            console.log("Not logged in");
            if (document.getElementById("logout").style.visibility == "visible") {
                document.getElementById("logout").style.visibility = "hidden";
            }
        }
    });
}

function emailCheck(email) {
    atSplit = email.split('@');
    if (atSplit.length == 2 && alphaNumCheck(atSplit[0])) {
        periodSplit = atSplit[1].split('.')
        if (periodSplit.length == 2 && alphaNumCheck(periodSplit[0] + periodSplit[1])) {
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

// From example.
function alphaNumCheck(entry) {
    let regex = /^[a-z0-9]+$/i;
    if (entry != null && entry.match(regex)) {
        return true;
    } else {
        return false;
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
