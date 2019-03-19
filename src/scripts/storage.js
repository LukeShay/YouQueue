function createUDB() {
    firebase.firestore().doc(uid + "/blank").set({
        null: null
    });
    udb = firestore.collection(uid);

    //newQueue("test", {1:"link1", 2:"link2", 3:"link3"});
}

function newQueue(queueName, list){ // List must be an object like above
    var newQ = udb.doc(queueName); // Creates new queue
    newQ.set(list);

    newQ.get().then(doc => { // Example of how to retrieve the data. newQ = firebase.firestore().collection(uid).doc(queueName)
        var temp = doc.data();
        console.log(doc.data());
        console.log(temp[1]);
    });
}