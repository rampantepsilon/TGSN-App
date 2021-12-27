const Store = require('./store.js');

const { Octokit } = require("@octokit/core");
require('dotenv').config()

const store = new Store({
  configName: 'user-prefences',
  defaults: {
    min2Tray: 'false',
    showNotifs: 'true'
  }
})
const storeInfo = new Store({
  configName: 'user-info',
  defaults: {
    loggedIn: 'no',
    access: 'guest'
  }
})

//Variables
var currentPage;
var defaultScript;
let chatShown = 1;
var username;

var playerHeight = window.innerHeight-60;

//Redirect Function
function showWin(num){
  const app = firebase.app();
  const db = firebase.firestore();
  const timestamp = db.collection('users').doc('timestamp')
  if (sessionStorage.getItem('username')){
    var user = sessionStorage.getItem('username');
    var tsTime = new Date().toLocaleString();
    timestamp.update({
      [user]: tsTime
    })
  }
  for (i = 1; i < (webview.length + 2); i++){
      $('#' + i).hide();
  }

  $('#' + num).show();
  var loggedIn = storeInfo.get('loggedIn');

  for (j = 1; j < (webview.length + 1); j++){
    if (j != num){
      if (loggedIn == 'no'){
        if (j < 7){
          document.getElementById('button' + j).className = 'navButton';
        }
      } else {
        document.getElementById('button' + j).className = 'navButton';
      }
    } else {
        document.getElementById('button' + j).className = 'navButtonSelected';
    }
  }
  currentPage = num;
  if (num == '3' || num == '4'){
    refresh();
  }
}
function adminShowWin(num){
  const app = firebase.app();
  const db = firebase.firestore();
  const timestamp = db.collection('users').doc('timestamp')
  if (sessionStorage.getItem('username')){
    var user = sessionStorage.getItem('username');
    var tsTime = new Date().toLocaleString();
    timestamp.update({
      [user]: tsTime
    })
  }
  for (i = 1; i < (adminView.length + 2); i++){
      $('#' + i).hide();
  }
  $('#' + num).show();
  sessionStorage.setItem('location', num);
  for (j = 1; j < (adminView.length + 1); j++){
      if (j != num){
          document.getElementById('button' + j).className = 'navButton';
      } else {
          document.getElementById('button' + j).className = 'navButtonSelected';
      }
  }
  $('#chatmain').hide();
  currentPage = num;
  if (num == '3' || num == '4'){
    refresh();
  }
}

//Chat
function showChat(){
  if (chatShown == 1){
    $('#chat').hide();
    chatShown = 2;
  } else {
    $('#chat').show();
    chatShown = 1;
  }
}

//Hide All Windows Except the main on load
function init(){
    //Variables
    var content = document.getElementById('content');
    var buttons = document.getElementById('buttons');
    var uName = document.getElementById('uNameStatic');
    var loggedIn = storeInfo.get('loggedIn');
    var access = storeInfo.get('access');
    content.innerHTML = '';

    //Login Functions
    var sUser;
    if (sessionStorage.getItem('username')){
      sUser = sessionStorage.getItem('username')
    } else {
      sUser = '';
    }
    var sLogo = sessionStorage.getItem('logo');
    const app = firebase.app();
    const db = firebase.firestore();
    const login = db.collection('users').doc('logins')
    login.get().then((doc) => {
      const users = doc.data();
      var userNames = users['formatNames'];
      for (var j = 0; j < users.numUsers; j++){
        if (sUser.toLowerCase() == userNames[j].toLowerCase()){
          sessionStorage.setItem('position', users['position'][j]);
        }
      }
    });
    var sPosition = sessionStorage.getItem('position');
    if (sUser){
      document.getElementById('uNameStatic').innerHTML = sUser + `<br><button onclick='changePass()'>Change Password</button><button onclick='logout()'>Logout</button>`;
      document.getElementById('userPic').innerHTML = `<img src='` + sLogo + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`
      document.getElementById('positionTag').innerHTML = sPosition + ` HQ`;
    } else {
      uName.innerHTML = `Not Signed In<br><button onclick='login()'>Login</button>`
    }

    //Add Refresh Button
    buttons.innerHTML = [`
      <tr>
        <td align='center' class='navButtonSelected' valign='middle' id='buttonRefresh' style='position:fixed; bottom: 15; border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="refresh()">
          <img src='./images/refresh.png' width='20px' height='20px'><br>Refresh Page
        </td>
      </tr>`];

    if (loggedIn == 'yes'){
      if (access == 'Network Admin'){
        //Add Saved Links
        for (j = 1; j < (adminView.length + 1); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + adminView[j - 1][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 1; k < (adminView.length + 1); k++){
            /*if (k == (adminView.length)){
              buttons.innerHTML += `<td align='center' style='font-size: 40px;'> | </td>`
            }*/
            buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="adminShowWin('` + k + `')">` + adminView[k - 1][1] + `</td></tr>`
        }
        // Add Chat
        var cell = content.insertCell(j-1);
        cell.innerHTML = [`
          <td valign='top' height='100%'>
            <div id='send-message' align='center'>
              <textarea id="chat-txt" class="textarea" placeholder="What do you want to say?"></textarea>
              <button id="chat-btn" type="submit" onclick='postChat()'>Submit</button>
            </div>
            <div width='100%' id="messages" style='height: calc(100% - 45px); overflow-y: scroll;'></div>
          </td>`];
        cell.style.width = '400px';
        cell.setAttribute('id', 'chat');
        //Add Chat Button
        /*buttons.innerHTML += `<td align='center' style='font-size: 40px;'> | </td>`;
        buttons.innerHTML += `<td align='center' id='buttonChat' style='border-style: outset; border-radius: 25% 25% 25% 25%; background-color: #333; color: orange; width: 110px; height: 50px;' onclick="showChat()">Show/Hide Chat</td>`*/

        for (i = 2; i < (adminView.length + 1); i++){
          $('#' + i).hide();
        }
        if (chatShown == 1){
          $('#chat').show();
        }
      } else if (access == 'TGSN Coordinator') {
        //Add Saved Links
        for (j = 1; j < (coordView.length + 1); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + coordView[j - 1][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 1; k < (coordView.length + 1); k++){
            /*if (k == (coordView.length)){
              buttons.innerHTML += `<td align='center' style='font-size: 40px;'> | </td>`
            }*/
            buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="adminShowWin('` + k + `')">` + coordView[k - 1][1] + `</td></tr>`
        }
        // Add Chat
        var cell = content.insertCell(j-1);
        cell.innerHTML = [`
          <td valign='top' height='100%'>
            <div id='send-message' align='center'>
              <textarea id="chat-txt" class="textarea" placeholder="What do you want to say?"></textarea>
              <button id="chat-btn" type="submit" onclick='postChat()'>Submit</button>
            </div>
            <div width='100%' id="messages" style='height: calc(100% - 45px); overflow-y: scroll;'></div>
          </td>`];
        cell.style.width = '400px';
        cell.setAttribute('id', 'chat');

        for (i = 2; i < (coordView.length + 1); i++){
          $('#' + i).hide();
        }
        if (chatShown == 1){
          $('#chat').show();
        }
      } else {
        //Add Saved Links
        for (j = 1; j < (webview.length + 1); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' webpreferences='webviewTag' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + webview[j - 1][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 1; k < (webview.length + 1); k++){
          buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 1][1] + `</td></tr>`
        }
        //Add Chat
        var cell = content.insertCell(j-1);
        cell.innerHTML = [`
          <td valign='top' height='100%'>
            <div id='send-message' align='center'>
              <textarea id="chat-txt" class="textarea" placeholder="What do you want to say?"></textarea>
              <button id="chat-btn" type="submit" onclick='postChat()'>Submit</button>
            </div>
            <div width='100%' id="messages" style='height: 100%; overflow-y: scroll;'></div>
          </td>`];
        cell.style.width = '400px';
        cell.setAttribute('id', 'chat');

        //Hide other webviews
        for (i = 2; i < (webview.length + 1); i++){
          $('#' + i).hide();
        }
        if (chatShown == 1){
          $('#chat').show();
        }
      }
    } else {
      //Add Saved Links
      for (j = 1; j < (webview.length); j++){
          var cell = content.insertCell(j-1);
          cell.innerHTML = `<webview style='height:100%' webpreferences='webviewTag' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + webview[j - 1][0] + `'></webview>`;
          cell.style.width = '80%';
          cell.setAttribute('id', j);
      }
      //Add Buttons
      for (k = 1; k < (webview.length); k++){
        buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 1][1] + `</td></tr>`
      }
      //Add Chat
      var cell = content.insertCell(j-1);
      cell.innerHTML = [`
        <td valign='top' height='100%'>
          <div id='send-message' align='center'>
            <textarea id="chat-txt" class="textarea" placeholder="What do you want to say?"></textarea>
            <button id="chat-btn" type="submit" onclick='postChat()'>Submit</button>
          </div>
          <div width='100%' id="messages" style='height: 100%; overflow-y: scroll;'></div>
        </td>`];
      cell.style.width = '400px';
      cell.setAttribute('id', 'chat');

      //Hide other webviews
      for (i = 2; i < (webview.length); i++){
        $('#' + i).hide();
      }
      if (chatShown == 1){
        $('#chat').show();
      }
    }

    document.getElementById('button1').className='navButtonSelected'
    //Staff Chat Resources
    document.getElementById('chat-txt').onkeyup = function(){
      if (event.keyCode === 13){
        postChat();
      }
    }

    if (sUser != ''){
      document.getElementById('messages').style.height = 'calc(100% - 45px)';
    } else {
      $("#send-message").hide();
    }

    $('#chat').hide();
    listener();
    setTimeout(updateChecker, 1000);
}

//Login
function login(){
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName('close')[0];

  var uName = document.getElementById('uName');
  var pWord = document.getElementById('pWord');
  uName.onkeyup = function(){
    if (event.keyCode === 13){
      fLogin();
    }
  }
  pWord.onkeyup = function(){
    if (event.keyCode === 13){
      fLogin();
    }
  }

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
  uName.focus();
}
function fLogin(){
  var uName = document.getElementById('uName').value.toLowerCase();
  var pWord = calcMD5(document.getElementById('pWord').value);
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')
  const timestamp = db.collection('users').doc('timestamp')

  login.get().then((doc) => {
    const users = doc.data();
    var userNames = users['formatNames'];

    if (users[uName]){
      if (users[uName] == pWord){
        document.getElementById('loginError').innerHTML = 'Login Successful';
        setTimeout(function(){document.getElementById('loginError').innerHTML = ''; document.getElementById('uName').value = ''; document.getElementById('pWord').value = '';}, 1000)
        document.getElementById('myModal').style.display = 'none';
        document.getElementById('messages').style.height = 'calc(100% - 60px)'
        $("#send-message").show();

        //Update User Fields
        for (var j = 0; j < users.numUsers; j++){
          if (uName == userNames[j].toLowerCase()){
            document.getElementById('uNameStatic').innerHTML = userNames[j] + `<br><button onclick='changePass()'>Update Information</button><button onclick='logout()'>Logout</button>`;
            document.getElementById('userPic').innerHTML = `<img src='` + users['logo'][j] + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`;
            document.getElementById('positionTag').innerHTML = users['position'][j] + ` HQ`;
            //Set Storage
            sessionStorage.setItem('username', userNames[j])
            sessionStorage.setItem('logo', users['logo'][j])
            sessionStorage.setItem('position', users['position'][j])
            storeInfo.set('loggedIn', 'yes');
            storeInfo.set('access', users['position'][j])
            var tsUName = userNames[j];
            var tsTime = new Date().toLocaleString();
            timestamp.update({
              [tsUName]: tsTime
            })
            init();
            replys();
          }
        }
        for (var i = 1; i < id; i ++){
          $('#replyField' + i).show();
        }
      } else {
        document.getElementById('loginError').innerHTML = 'Incorrect Password'
      }
    } else {
      console.log('User Fails')
      document.getElementById('loginError').innerHTML = 'User Does Not Exist. If this is an error, please contact RampantEpsilon on Discord.'
    }
  })
}
function logout(){
  var sPosition = sessionStorage.getItem('position');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('logo');
  sessionStorage.removeItem('position');
  var uName = document.getElementById('uNameStatic');
  uName.innerHTML = `Not Signed In<br><button onclick='login()'>Login</button>`;
  document.getElementById('positionTag').innerHTML = `Staff HQ`;
  document.getElementById('userPic').innerHTML = '';
  document.getElementById('content').innerHTML = [``];
  document.getElementById('buttons').innerHTML = '';
  storeInfo.set('loggedIn', 'no');
  storeInfo.set('access', 'guest')
  init();
}
function changePass(){
  var modal = document.getElementById('passModal');
  var span = document.getElementsByClassName('close')[1];

  var oldPass = document.getElementById('oldPass');
  var newPass = document.getElementById('newPass');
  var confirmPass = document.getElementById('confirmPass');
  var newAvatar = document.getElementById('newAvatar');
  oldPass.onkeyup = function(){
    if (event.keyCode === 13){
      upd8Pass();
    }
  }
  newPass.onkeyup = function(){
    if (event.keyCode === 13){
      upd8Pass();
    }
  }
  confirmPass.onkeyup = function(){
    if (event.keyCode === 13){
      upd8Pass();
    }
  }
  newAvatar.onkeyup = function(){
    if (event.keyCode === 13){
      upd8Avatar();
    }
  }

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
  oldPass.focus();
}
function upd8Pass(){
  var oldPass = calcMD5(document.getElementById('oldPass').value);
  var newPass = calcMD5(document.getElementById('newPass').value);
  var confirmPass = calcMD5(document.getElementById('confirmPass').value);
  var user = sessionStorage.getItem('username').toLowerCase();
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')

  login.onSnapshot(doc => {
    const users = doc.data();

    if (newPass.length > 5){
      if (confirmPass == newPass){
        if (users[user] == oldPass){
          document.getElementById('passError').innerHTML = "Password Changed";
          setTimeout(function(){
            login.update({
              [user]: newPass
            });
            document.getElementById('passModal').style.display = 'none';
          }, 1000)
        } else {
          //If old doesn't match current
          document.getElementById('passError').innerHTML = "Old Password doesn't match. Please try again.";
        }
      } else {
        //If new and confirm don't match
        document.getElementById('passError').innerHTML = "New Passwords don't match. Please try again.";
      }
    } else {
      document.getElementById('passError').innerHTML = "New Password must be 6 characters or more.";
    }

    document.getElementById('oldPass').value = '';
    document.getElementById('newPass').value = '';
    document.getElementById('confirmPass').value = '';
  })
}
function upd8Avatar(){
  var newAvatar = document.getElementById('newAvatar').value;
  var user = sessionStorage.getItem('username').toLowerCase();
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')

  login.onSnapshot(doc => {
    const users = doc.data();

    if (newAvatar){
      for (var i = 0; i < users.numUsers; i++){
        if (user == users.formatNames[i].toLowerCase()){
          var index = "logo." + i;
          document.getElementById('passError').innerHTML = "Avatar Updated. Refresh (F5) for changes to take place.";
          setTimeout(function(){
            login.update({
              [index]: newAvatar
            });
            sessionStorage.setItem('logo', newAvatar);
            document.getElementById('passModal').style.display = 'none';
          }, 1000)
        }
      }
    }
  })
}

//Refresh Page
function refresh(){
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')
  var sUser;
  if (sessionStorage.getItem('username')){
    sUser = sessionStorage.getItem('username');
  } else {
    sUser = '';
  }
  login.get().then((doc) => {
    const users = doc.data();
    var userNames = users['formatNames'];
    for (var j = 0; j < users.numUsers; j++){
      if (sUser.toLowerCase() == userNames[j].toLowerCase()){
        sessionStorage.setItem('position', users['position'][j]);
      }
    }
  });
  if (sessionStorage.getItem('position') == 'Network Admin'){
    document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + adminView[parseInt(currentPage - 1)][0] + `'></webview>`;
  } else if (sessionStorage.getItem('position') == 'TVS Coordinator' || sessionStorage.getItem('position') == 'TGSN Coordinator'){
    document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + coordView[parseInt(currentPage - 1)][0] + `'></webview>`;
  } else {
    document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + webview[parseInt(currentPage - 1)][0] + `'></webview>`;
  }
}

/*Chat Module Start*/
const db = firebase.firestore();
var id;

//Set id
db.collection('chat').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})

function postChat(){
  //e.preventDefault();
  const date = new Date().toLocaleString();
  const chatTxt = document.getElementById('chat-txt');
  const message = chatTxt.value;
  const icon = sessionStorage.getItem('logo');
  const important = 'disabled'
  chatTxt.value = '';

  db.collection('chat').doc('main').update({
    [id]: [username, date, message, icon, important]
  })
  var replycount = 'replyCount.'+id;
  id = parseInt(id)+1;
  db.collection('chat').doc('data').update({
    id: id,
    [replycount]: 1
  })
}

function notificationListener(){
  db.collection('app').doc('main').onSnapshot(doc => {
    const data = doc.data();
    var notifID;
    db.collection('app').doc('data').get().then((doc) => {
      notifID = doc.data().id;

      var message = data[notifID - 1][1].replace(/<br>/g, '\n').substr(0,70);
      if (sessionStorage.getItem('showNotifs') == 'yes'){}
      new Notification(
        'New Message',
        {
          body: message + '...\n\nRead More on the Message Board',
          icon: './logo.jpg'
        }
      )
    })
  })
}

//Listen for updates
function listener(){
  db.collection('chat').doc('main').onSnapshot(doc => {
    const data = doc.data();

    document.getElementById('messages').innerHTML = "";

    for (var i = 1; i < id; i ++){
    if (data[i] == null){

    } else {
      const msg = [`
        <div id ='` + i + `' class='chat' style='border-style: outset; padding: 5px; overflow-y: scroll;'>
          <table width='100%'>
            <tr>
              <td width='20px'>
                <img src='` + data[i][3] + `' width='30px' height='30px' style='border-radius: 50%' />
              </td>
              <td><font size='4em'>` + data[i][0] + `</font></td>
              <td align='right'>
                <font size= '2px' color='#222'>` + data[i][1] + `</font>
              </td>
            </tr>
            <tr>
              <td colspan='3' style="padding: 10px">`
                + data[i][2] + `
              </td>
            </tr>
            <tr>
              <td colspan='3' id='replyField` + i + `'>
                <div style="border: outset; width: 100px;" align='center' onclick='replyDialog(` + i + `)' id='replyButton` + i + `'>Reply</div>
              </td>
            </tr>
            <tr>
              <td colspan='3'>
                <div id='` + i + `reply'></div>
              </td>
            </tr>
          </table>
        </div>`];
      document.getElementById("messages").innerHTML = msg + document.getElementById("messages").innerHTML;
    }
  }

    replys();
    username = sessionStorage.getItem('username');
    if (username == null){
        for (var j = 1; j < id; j ++){
        $('#replyField' + j).hide();
      }
    }
    document.getElementById('chat-txt').onkeyup = function(){
      if (event.keyCode === 13){
        postChat();
      }
    }
  })
}

function replyDialog(num){
  var replyField = document.getElementById('replyField' + num);
  $("#replyButton" + num).hide();
  replyField.innerHTML += [`
    <span id='replyForm` + num + `'>
      <textarea id='replyMSG` + num + `' class="textarea" placeholder="What do you want to say?"></textarea>
      <button onclick='sendReply(` + num + `)'>Reply</button>
    </span>
  `]
  document.getElementById('replyMSG' + num).onkeyup = function(){
    if (event.keyCode === 13){
      sendReply(num);
    }
  }
}

function sendReply(num){
  var replyCount;

  //Get Reply count
  db.collection('chat').doc('data').get().then((doc) => {
    const data = doc.data();
    replyCount = parseInt(data.replyCount[num]);

    const date = new Date().toLocaleString();
    const chatTxt = document.getElementById('replyMSG' + num);
    const message = chatTxt.value;
    const icon = sessionStorage.getItem('logo');
    chatTxt.value = '';

    var replyPosition = num + "." + replyCount;

    db.collection('chat').doc('reply').update({
      [replyPosition]: [username, date, message, icon]
    })
    var pass = 'replyCount.' + num;
    var newCount = replyCount + 1;
    db.collection('chat').doc('data').update({
      [pass]: newCount,
    })
    document.getElementById('replyField' + num).innerHTML = `<span style="border: outset;" onclick='replyDialog(` + num + `)' id='replyButton` + num + `'>Reply</span>`;
  })
}

function replys(){
  db.collection('chat').doc('reply').onSnapshot(doc => {
    const data = doc.data();

    for (var i = 1; i < id; i++){
      if (document.getElementById(i + 'reply') != null){
        if (data[i]){
          var len = 0;
          for (var count in data[i]){
            len++;
          }
          if (len > 2){
            document.getElementById(i + 'reply').innerHTML = '';
            document.getElementById(i + 'reply').innerHTML += `<br><span onclick='forceReplies("` + i + `")'>Show more comments</span>`;
            for (var j = (len-1); j < len+1; j++){
              const msg = `<table width='100%' style='border-style: inset; padding: 5px;'>
                <tr>
                  <td width='20px'>
                    <img src='` + data[i][j][3] + `' width='30px' height='30px' style='border-radius: 50%' />
                  </td>
                  <td>` + data[i][j][0] + `</td>
                  <td align='right'>
                    <font size= '2px' color='#222'>` + data[i][j][1] + `</font>
                  </td>
                </tr>
                <tr>
                  <td colspan='3'>`
                    + data[i][j][2] +
                  `</td>
                </tr>
              </table>`;
              document.getElementById(i + 'reply').innerHTML += msg;
            }
          } else {
            document.getElementById(i + 'reply').innerHTML = '';
            for (var j = 1; j < len+1; j++){
              const msg = `<table width='100%' style='border-style: inset; padding: 5px;'>
                <tr>
                  <td width='20px'>
                    <img src='` + data[i][j][3] + `' width='30px' height='30px' style='border-radius: 50%' />
                  </td>
                  <td>` + data[i][j][0] + `</td>
                  <td align='right'>
                    <font size= '2px' color='#222'>` + data[i][j][1] + `</font>
                  </td>
                </tr>
                <tr>
                  <td colspan='3'>`
                    + data[i][j][2] +
                  `</td>
                </tr>
              </table>`;
              document.getElementById(i + 'reply').innerHTML += msg;
            }
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
      const msg = `<table width='100%' style='border-style: inset; padding: 5px;'>
        <tr>
          <td width='20px'>
            <img src='` + data[i][j][3] + `' width='30px' height='30px' style='border-radius: 50%' />
          </td>
          <td>` + data[i][j][0] + `</td>
          <td align='right'>
            <font size= '2px' color='#222'>` + data[i][j][1] + `</font>
          </td>
        </tr>
        <tr>
          <td colspan='3'>`
            + data[i][j][2] +
          `</td>
        </tr>
      </table>`;
      document.getElementById(i + 'reply').innerHTML += msg;
    }
  })
}
/*Chat Module End*/

/*Update Module*/
var newUpdate = 0;
async function updateChecker(){
  var buttons = document.getElementById('buttons');
  const octokit = new Octokit({ auth: process.env.GITHUB });
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
    owner: 'rampantepsilon',
    repo: 'TGSN-Staff-App'
  })
  const currentVer = require('electron').remote.app.getVersion();
  if (response.data.tag_name > currentVer){
    if (newUpdate == 0){
      buttons.innerHTML += `<tr>
        <td align='center' valign='middle' id='buttonUpdate' style='border-style: outset; border-radius: 25% 25% 25% 25%; background-color: orange; color: #333; width: 110px; height: 50px;' onclick='openUpdate("` + response.data.html_url + `")'>
          Update to v` + response.data.tag_name + `
        </td>
      </tr>`;
      newUpdate = 1;
    }
  }
}

function openUpdate(url){
  window.open(url, '_blank');
}

setInterval(updateChecker, 600000)
