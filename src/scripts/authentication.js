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

        // Sign up
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        
        // Catches error
        promise.catch(e => {
            console.log(e.code + ": " + e.message)

        });
    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    });



    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            document.getElementById("logout").style.visibility = "visible";
        } else {
            console.log("Not logged in");
            document.getElementById("logout").style.visibility = "hidden";
        }
    });
}());



