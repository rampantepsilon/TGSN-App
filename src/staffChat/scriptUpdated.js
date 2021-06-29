const firebaseConfig = {
  apiKey: "AIzaSyBAF1jevSp8_E5Okk9z6sMi-t4eRS4N9DE",
  authDomain: "tgsn-site-v7.firebaseapp.com",
  databaseURL: "https://tgsn-site-v7.firebaseio.com",
  projectId: "tgsn-site-v7",
  storageBucket: "tgsn-site-v7.appspot.com",
  messagingSenderId: "565689666494",
  appId: "1:565689666494:web:fc488b17f5018f569547ef"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
var id;

//Set id
db.collection('chat').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})

//Change later
document.getElementById('send-message').style.display = 'none';
var username;
function uName(){
  username = document.getElementById('uName').value;
  document.getElementById('send-message').style.display = 'initial';
  document.getElementById('username').style.display = 'none';
}

document.getElementById('send-message').addEventListener('submit', postChat);

function postChat(e){
  e.preventDefault();
  const date = new Date().toLocaleString();
  const chatTxt = document.getElementById('chat-txt');
  const message = chatTxt.value;
  chatTxt.value = '';

  db.collection('chat').doc('main').update({
    [id]: [username, date, message]
  })
  id = parseInt(id)+1;
  db.collection('chat').doc('data').set({
    id: id
  })
}

db.collection('chat').doc('main').onSnapshot(doc => {
  const data = doc.data();

  document.getElementById('messages').innerHTML = "";

  for (var i = 1; i < id; i ++){
    const msg = `<div id ='` + i + `' style='border-style: outset; padding: 5px;'>` + data[i][0] + ` at ` + data[i][1] + `<br>` + data[i][2] + `<div id='` + i + `reply'></div></div>`;
    document.getElementById("messages").innerHTML = msg + document.getElementById("messages").innerHTML;
  }

  replys();
})

function replys(){
  db.collection('chat').doc('reply').onSnapshot(doc => {
    const data = doc.data();
    console.log(data)

    for (var i = 1; i < id; i++){
      if (data[i]){
        var len = 0;
        for (var count in data[i]){
          len++;
        }
        if (len > 2){
          document.getElementById(i + 'reply').innerHTML += `<br><span onclick='forceReplies("` + i + `")'>Show more comments</span>`;
          for (var j = (len-1); j < len+1; j++){
            const msg = "<div style='border-style: inset; padding: 10px'>" + data[i][j][0] + " at " + data[i][j][1] + "<br>" + data[i][j][2] + `</div>`;
            document.getElementById(i + 'reply').innerHTML += msg;
          }
        } else {
          for (var j = 1; j < len+1; j++){
            const msg = "<div style='border-style: inset; padding: 10px'>" + data[i][j][0] + " at " + data[i][j][1] + "<br>" + data[i][j][2] + `</div>`;
            document.getElementById(i + 'reply').innerHTML += msg;
          }
        }
      }
    }
  })
}

function forceReplies(i){
  db.collection('chat').doc('reply').onSnapshot(doc => {
    const data = doc.data();

    document.getElementById(i + 'reply').innerHTML = '<br>'

    var len = 0;
    for (var count in data[i]){
      len++;
    }

    for (var j = 1; j < len+1; j++){
      const msg = "<div style='border-style: inset; padding: 10px'>" + data[i][j][0] + " at " + data[i][j][1] + "<br>" + data[i][j][2] + `</div>`;
      document.getElementById(i + 'reply').innerHTML += msg;
    }
  })
}
