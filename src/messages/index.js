/*function messages(){
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
      break;
    case 2:
      messages.update({
        2: newMessage
      })
      break;
    case 3:
      messages.update({
        3: newMessage
      })
      break;
    case 4:
      messages.update({
        4: newMessage
      })
      break;
    case 5:
      messages.update({
        5: newMessage
      })
      break;
    case 6:
      messages.update({
        6: newMessage
      })
      break;
    default:
      break;
  }
}*/

/*Chat Module Start*/
const app = firebase.app();
const db = firebase.firestore();
var id;

//Set id
db.collection('app').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})

function postChat(){
  //e.preventDefault();
  const date = new Date().toLocaleString();
  const chatTxt = document.getElementById('chat-txt');
  const message = chatTxt.value;
  chatTxt.value = '';

  db.collection('app').doc('main').update({
    [id]: [date, message]
  })
  id = parseInt(id + 1);
  db.collection('app').doc('data').update({
    id: id
  })
}

//Listen for updates
function listener(){
  db.collection('app').doc('main').onSnapshot(doc => {
    const data = doc.data();

    document.getElementById('messages').innerHTML = "";

    for (var i = 1; i < id; i ++){
      if (data[i] == null){

      } else {
        const msg = [`
          <div id ='` + i + `' class='chat' style='border-style: double; padding: 5px; position: relative'>
            <div align='left' valign='top' style="width: calc(100% - 220px);">` +
              data[i][1] +
            `</div>
            <div width='150px' style="padding: 10px; position: absolute; top: 0; right: 0;" valign='top' align='right'><font color='#333' size='2em'>Posted At `
              + data[i][0] + `</font>
            </div>
          </div>`];
        document.getElementById("messages").innerHTML = msg + document.getElementById("messages").innerHTML;
      }
    }
  })
}
/*Chat Module End*/
