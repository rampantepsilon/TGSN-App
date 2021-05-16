function messages(){
  const app = firebase.app();
  const db = firebase.firestore();
  const messages = db.collection('app').doc('messages')

  messages.onSnapshot(doc => {
    const mainG = doc.data();
    var mainData = mainG['main'];

    for (var j = 0; j < 6; j++){
      var mess = 'message' + j;
      document.getElementById(mess).innerHTML = "";
    }

    for (var i = 0; i < mainData.length; i++){
      var mess = 'message' + i;
      document.getElementById(mess).innerHTML = mainG['main'][i];
    }
  })
}
