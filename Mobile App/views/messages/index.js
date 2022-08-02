/*Chat Module Start*/
const app = firebase.app();
const db = firebase.firestore();
var id;

//Set id
db.collection('app').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})

function showMBL(){
  var modal = document.getElementById('mbModal');
  var span = document.getElementsByClassName('close')[1];

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
}

function addLinkImage(type){
  const chatTxt = document.getElementById('chat-txt');
  var message = chatTxt.value;
  var modal = document.getElementById('mbModal');
  var link = document.getElementById('messageBoardLink').value;

  if (type == 'link'){
    message = message + "[url='" + link + "']" + link + "[/url]"
  }
  if (type == 'image'){
    message = message + "[img]" + link + "[/img]"
  }
  chatTxt.value = message;

  modal.style.display = 'none';
}

function postChat(){
  //e.preventDefault();
  const date = new Date().toLocaleString();
  const chatTxt = document.getElementById('chat-txt');
  const message = chatTxt.value;
  chatTxt.value = '';
  var msgFB = message.replace(/\[url=\'/g, "<a target='_blank' href='").replace(/\'\]/g, "'>").replace(/\[\/url\]/g, '</a>').replace(/\[img\]/g, "<img src='").replace(/\[\/img\]/g, "' />").replace(/\n/g, '<br>');
  var msgDiscord = message.replace(/(' width).*?px\[/g,"[").replace(/\[.*?\]/g, "");

  //Test DB when stuff breaks
  /*db.collection('app').doc('test').update({
    "0": [date, msgFB]
  })*/

  db.collection('app').doc('main').update({
    [id]: [date, msgFB]
  })
  id = parseInt(id + 1);
  db.collection('app').doc('data').update({
    id: id
  })
  var request = new XMLHttpRequest();
  request.open("POST", discordlink)
  request.setRequestHeader('Content-type', 'application/json');
  var params = {
      content: msgDiscord
  }
  request.send(JSON.stringify(params));

  document.querySelector("#chat-txt").style.height = 'auto';
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
            <div width='150px' style="padding: 10px; top: 0; right: 0;" valign='top' align='right'><font color='#333' size='2em'>Posted At `
              + data[i][0] + `</font>
            </div>
            <div align='left' valign='top' style="width: 100%">` +
              data[i][1] +
            `</div>
          </div>`];
        document.getElementById("messages").innerHTML = msg + document.getElementById("messages").innerHTML;
      }
    }
  })
}
/*Chat Module End*/

function showHelp(){
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName('close')[0];

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
}
