const newQueueBtn = document.getElementById("newQueueBtn");
const queueName = document.getElementById("queueName");
const videoSearch = document.getElementById("videoSearch");
const undoBtn = document.getElementById("undo");
const saveBtn = document.getElementById("save");
const curText = document.getElementById("curText");
const searchError = document.getElementById("searchError");


newQueueBtn.style.display = "block";
queueName.style.display = "none";
videoSearch.style.display = "none";
undoBtn.style.display = "none";
saveBtn.style.display = "none";
curText.innerHTML = "";
searchError.innerHTML = "";

newQueueBtn.addEventListener("click", e => {
  newQueueBtn.style.display = "none";
  queueName.style.display = "block";
  videoSearch.style.display = "block";
  undoBtn.style.display = "block";
  saveBtn.style.display = "block";
  curText.innerHTML = "";
  searchError.innerHTML = "";
});

/**
 * Fetches queues from firebase and adds them to the "curText" div in the queueContainer.
 */
var addQueuesToHTML = () => {
  firebase.firestore().collection(uid).where("valid", "==", true).get().then(querySnap => {
    querySnap.forEach(doc => {
      curText.innerHTML = doc.data();
    });
  });
}; 

var searchByKeyword = keyword => {

};

var searchByLink = keyword => {
  
};