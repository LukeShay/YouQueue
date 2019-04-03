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
 * @param {JSON Object} list 
 */
function newQueue(queueName, list) { // List must be an object
    var newQ = udb.doc(queueName); // Creates new queue
    addToQueue(queueNameDB, [queueName]);

    newQ.set(list);
}

/**
 * Adds new items to an already existing queue. This can also create a new queue but cannot override an old one.
 * @param {string} queueName 
 * @param {array} list 
 */
function addToQueue(queueName, list) { // List must be an object
    var q = udb.doc(queueName);

    q.update(list);
}

/**
 * Gets the names of all the queues and returns them as an object.
 */
function getNamesOfQueues(){
    var obj = {};

    udb.doc(queueNameDB).get().then(doc => {
        obj = doc.data();
    });
}

function getCurQueue(){ // Does not work
    var temp = {};
    chrome.storage.sync.get(null, result => {
        temp = result;
    });
    return temp;
}