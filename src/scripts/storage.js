const queueNameDB = "queues";

function createUDB() {
    firebase.firestore().doc(uid + "/" + queueNameDB).set({
        null: null
    });
    udb = firestore.collection(uid);

    //newQueue("test", ["link1", "link2", "link3"]);
    //addToQueue("test", ["link4"]);
}

/**
 * Creates a new queue with the given name and links. This function can also override a previously made queue.
 * @param {string} queueName 
 * @param {array} list 
 */
function newQueue(queueName, list) { // List must be an array like above
    var newQ = udb.doc(queueName); // Creates new queue
    addToQueue(queueNameDB, [queueName]);

    var obj = {};
    var i = 0;

    list.forEach((value, index) => { // Turns array into an object
        obj[index] = value;
    });

    newQ.set(obj); // Sets new queue to contain the array

    newQ.get().then(doc => { // Example of how to retrieve the data. newQ = firebase.firestore().collection(uid).doc(queueName)
        console.log(doc.data());
    });
}

/**
 * Adds new items to an already existing queue. This can also create a new queue but cannot override an old one.
 * @param {string} queueName 
 * @param {array} list 
 */
function addToQueue(queueName, list) { // List must be an array
    var q = udb.doc(queueName);
    var curLen = 0;
    var obj = {};

    q.get().then(doc => {
        obj = doc.data();
        curLen = Object.keys(obj).length;

        console.log(obj);
        console.log(curLen);

        list.forEach((value, index) => {
            obj[index + curLen] = value;
        });

        q.update(obj);
    });
}

/**
 * Gets the names of all the queues and returns them as an array.
 */
function getNamesOfQueues(){
    var arr = [];
    var obj = {};

    udb.doc(queueNameDB).get().then(doc => {
        obj = doc.data();
        arr = Object.values(obj);

        console.log(arr);
    });
}