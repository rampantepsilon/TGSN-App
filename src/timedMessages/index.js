const db = firebase.firestore();
const rotator = db.collection('bot').doc('rotator');

//Message Holder
var messageList = []
//Store id for editing messages
var messageID;

//Update messages
rotator.onSnapshot(doc => {
  console.log('Rotator Updated : ' + doc.data().main)
  messageLength = doc.data().main.length;
  for (var i = 0; i < doc.data().main.length; i++) {
    messageList[i] = doc.data().main[i];
    if (i == 0) {
      document.getElementById('currentMessages').innerHTML = ''
    }
    document.getElementById('currentMessages').innerHTML += "<li onclick='selMessage(" + i + ")'>" + doc.data().main[i] + "</li>"
  }
}, err => {
  console.log('Encountered error: ${err}');
});

function addMessage() {
  //Get Message Content
  var messageToAdd = document.getElementById('message').value;

  rotator.update({
    main: firebase.firestore.FieldValue.arrayUnion(messageToAdd)
  });

  document.getElementById('message').value = ''
}

function selMessage(id) {
  //Add Clicked Message to Value for editing
  document.getElementById('message').value = messageList[id]
  messageID = id; //Used only for Editing
}

function delMessage() {
  var messageToDel = document.getElementById('message').value;

  rotator.update({
    main: firebase.firestore.FieldValue.arrayRemove(messageToDel)
  })

  document.getElementById('message').value = ''
}

function editMessage() {
  // Get Original Message to delete
  var originalMessage = messageList[messageID]

  rotator.update({
    main: firebase.firestore.FieldValue.arrayRemove(originalMessage)
  })

  addMessage();
}