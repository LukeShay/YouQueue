(function () {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyCAbT074yEI04tEJyVog4TqhveMIBU1ARA",
        authDomain: "test-85968.firebaseapp.com",
        databaseURL: "https://test-85968.firebaseio.com",
        projectId: "test-85968",
        storageBucket: "test-85968.appspot.com",
        messagingSenderId: "27175506409"
    };
    firebase.initializeApp(config);

    // Get elements
    const txtEmail = document.getElementById("email");
    const txtPassword = document.getElementById("password");
    const btnLogin = document.getElementById("login");
    const btnSignup = document.getElementById("signup");
    const btnLogout = document.getElementById("logout");

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
        });
    });

    btnSignup.addEventListener('click', e => {
        // TODO: check for real email and secure password.
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
                console.log(e.code + ": " + e.message)

            });

            document.getElementById("invalid").innerHTML = "";

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
    });



    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            if (document.getElementById("logout").style.visibility == "hidden") {
                document.getElementById("logout").style.visibility = "visible";
            }
        } else {
            console.log("Not logged in");
            if (document.getElementById("logout").style.visibility == "visible") {
                document.getElementById("logout").style.visibility = "hidden";
            }
        }
    });
}());

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