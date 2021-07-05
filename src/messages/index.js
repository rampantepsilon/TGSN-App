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
  var request = new XMLHttpRequest();
  request.open("POST", discordlink)
  request.setRequestHeader('Content-type', 'application/json');
  var params = {
      content: message.replace(/<br>/g, '\n')
  }
  request.send(JSON.stringify(params));
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
