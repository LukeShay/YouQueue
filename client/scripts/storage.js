const queueNameDB = "queues";

function createUDB() {
  firebase
    .firestore()
    .doc(uid + "/blank")
    .set({
      null: null
    });
  udb = firestore.collection(uid);
}

/**
 * Creates a new queue with the given name and links. This function can also override a previously made queue.
 * @param {string} queueName
 * @param {JSON Object} list
 */
function newQueue(queueName, list) {
  // List must be an object in the following format {1: {videoID:Title}}

  udb
    .doc(queueName)
    .delete()
    .then(() => {
      var newQ = udb.doc(queueName); // Creates new queue

      newQ.set(list);
      newQ.update({ valid: true });
    });
}

/**
 * Adds new items to an already existing queue. This can also create a new queue but cannot override an old one.
 * @param {string} queueName
 * @param {JSON Object} list
 */
function addToQueue(queueName, list) {
  // List must be an object in the following format {1: {videoID:Title}}. Overwrites any with matching keys.
  var q = udb.doc(queueName);

  q.update(list);
}

function getCurQueue() {
  var temp = {};
  chrome.storage.sync.get(null, result => {
    temp = result;
  });
  return temp;
}

function addQueueToStorage(queueName) {
  chrome.storage.sync.clear(() => {
    console.log("Storage cleared.");
  });

  document.getElementById("queue").innerHTML = "";

  udb
    .doc(queueName)
    .get()
    .then(snapshot => {
      chrome.storage.sync.set(snapshot.data(), () => {
        console.log("Storage set to: ", snapshot.data());
      });

      Object.values(snapshot.data()).forEach((obj, index) => {
        document.getElementById("queue").innerHTML +=
          Object.values(obj) + "<br>";
      });

      var msg = new Message();
      msg.requestType = "changeQueue";
      msg.sendMessage();
    });
}

function deleteQueue(queueName) {
  udb
    .doc(queueName)
    .delete()
    .then(() => {
      console.log(queueName + " has been deleted.");
    });
}
