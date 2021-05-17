function messages(){
  const app = firebase.app();
  const db = firebase.firestore();
  const messages = db.collection('app').doc('messages')

  messages.onSnapshot(doc => {
    const mainG = doc.data();
    var mainData = mainG['main'];

    for (var j = 1; j < 7; j++){
      var mess = 'message' + j;
      document.getElementById(mess).innerHTML = "";
      if (mainG[j]){
        document.getElementById(mess).innerHTML = mainG[j];
      }
    }
  })
}

function update(num){
  const app = firebase.app();
  const db = firebase.firestore();
  const messages = db.collection('app').doc('messages');
  var newMessage = document.getElementById('newMessage').value;

  switch(num){
    case 1:
      messages.update({
        1: newMessage
      })
    case 2:
      messages.update({
        2: newMessage
      })
    case 3:
      messages.update({
        3: newMessage
      })
    case 4:
      messages.update({
        4: newMessage
      })
    case 5:
      messages.update({
        5: newMessage
      })
    case 6:
      messages.update({
        6: newMessage
      })
    default:
      break;
  }
}
