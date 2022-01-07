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
        if (j < 9){
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
  if (num == '4' || num == '5'){
    refresh();
  }
}
function adminShowWin(num){

  const timestamp = db.collection('users').doc('timestamp')
  if (sessionStorage.getItem('username')){
    var user = sessionStorage.getItem('username');
    var tsTime = new Date().toLocaleString();
    timestamp.update({
      [user]: tsTime
    })
  }
  for (i = 1; i < (adminView.length + 3); i++){
      $('#' + i).hide();
  }
  $('#' + num).show();
  sessionStorage.setItem('location', num);
  for (j = 1; j < (adminView.length + 2); j++){
      if (j != num){
          document.getElementById('button' + j).className = 'navButton';
      } else {
          document.getElementById('button' + j).className = 'navButtonSelected';
      }
  }
  $('#chatmain').hide();
  currentPage = num;
  if (num == '4' || num == '5'){
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

//Dashboard Functions
//MBLight ID Start
const app = firebase.app();
const db = firebase.firestore();
var id;

//Set id
db.collection('app').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})
//MBLight ID End
function showDashboard(){
  for (j = 1; j < (adminView.length + 1); j++){
    if (document.getElementById('button' + j)){
      document.getElementById('button' + j).className = 'navButton';
    }
  }
  for (i = 1; i < (adminView.length + 2); i++){
    $('#' + i).hide();
  }
  document.getElementById('button1').className = 'navButtonSelected';
  $("#1").show();
  sessionStorage.setItem('location', 1);
}
function mbLight(){
  db.collection('app').doc('main').onSnapshot(doc => {
    const data = doc.data();
    var start = id - 1;

    for (var i = start; i < id; i ++){
      document.getElementById("mbLight").innerHTML = `
        <div id ='` + i + `' style='border-style: double; padding: 5px; position: relative'>
          <div align='left' valign='top' style="width: calc(100% - 220px);">` +
            data[i][1] +
          `</div>
          <div width='150px' style="padding: 10px; position: absolute; top: 0; right: 0;" valign='top' align='right'><font color='#333' size='2em'>Posted At `
            + data[i][0] + `</font>
          </div>
        </div>`;
    }
  })
}
function tgsnBot(){
  //Initialize Values

  const commands = db.collection('bot').doc('commands');

  commands.onSnapshot(doc => {
    const data = doc.data();
    var commandList = document.getElementById('commandsLight');

    var list = [];
    for (var j = 0; j < data.list.length; j++){
      list[j] = data.list[j];
    }

    list.sort();

    for (var i = 0; i < data.list.length; i++){
      commandList.innerHTML += [`!` + list[i] + `<ul><li>` + data.commands[list[i]] + `</li></ul></br>`]
    }
  });
}

//Hide All Windows Except the main on load
function init(){
    //Variables
    var content = document.getElementById('content');
    var buttons = document.getElementById('buttons');
    var uName = document.getElementById('uNameStatic');
    var loggedIn = storeInfo.get('loggedIn');
    var access = storeInfo.get('access');
    content.innerHTML = [`
      <td id='1' style="width:80%;">
        <table width='100%' height='100%' style='background-color: rgba(255,255,255,0.75)' border="1px">
          <tr style='height: calc(85vh - 520px);'>
            <td valign='top'>
              <h3 align='center'>Recent Message</h3>
              <div id='mbLight'></div>
            </td>
            <td valign='top'>
              <h3 align='center'>VDO.Ninja</h3>
              <div id='sideLight'></div>
            </td>
          </tr>
          <tr>
            <td valign='top' width='75%'>
              <h3 align='center'>Twitch Player/Chat</h3>
              <webview src='https://tgsnetwork.org/stream.html' id='twitchLight'></webview>
            </td>
            <td valign='top' width='25%'>
              <h3 align='center'>TGSNBot Commands</h3>
              <div id='commandsLight'></div>
            </td>
          </tr>
        </table>
      </td>
    `]

    //Login Functions
    var sUser;
    if (sessionStorage.getItem('username')){
      sUser = sessionStorage.getItem('username')
    } else {
      sUser = '';
    }
    var sLogo = sessionStorage.getItem('logo');
    const app = firebase.app();

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
        <td align='center' class='navButton' id='button1' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="showDashboard()">Dashboard</td>
      </tr>
      <tr>
        <td align='center' class='navButtonSelected' valign='middle' id='buttonRefresh' style='position:fixed; bottom: 15; border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="refresh()">
          <img src='./images/refresh.png' width='20px' height='20px'><br>Refresh Page
        </td>
      </tr>`];

    if (loggedIn == 'yes'){
      if (access == 'Network Admin'){
        //Add Saved Links
        for (j = 2; j < (adminView.length + 2); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + adminView[j - 2][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 2; k < (adminView.length + 2); k++){
            buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="adminShowWin('` + k + `')">` + adminView[k - 2][1] + `</td></tr>`
        }

        for (i = 2; i < (adminView.length + 2); i++){
          $('#' + i).hide();
        }
      } else if (access == 'TGSN Coordinator') {
        //Add Saved Links
        for (j = 2; j < (coordView.length + 2); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + coordView[j - 2][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 2; k < (coordView.length + 2); k++){
            buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="adminShowWin('` + k + `')">` + coordView[k - 2][1] + `</td></tr>`
        }

        for (i = 2; i < (coordView.length + 2); i++){
          $('#' + i).hide();
        }
      } else {
        //Add Saved Links
        for (j = 2; j < (webview.length + 2); j++){
            var cell = content.insertCell(j-1);
            cell.innerHTML = `<webview style='height:100%' webpreferences='webviewTag' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + webview[j - 2][0] + `'></webview>`;
            cell.style.width = '80%';
            cell.setAttribute('id', j);
        }
        //Add Buttons
        for (k = 2; k < (webview.length + 2); k++){
          buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 2][1] + `</td></tr>`
        }

        //Hide other webviews
        for (i = 2; i < (webview.length + 2); i++){
          $('#' + i).hide();
        }
      }
    } else {
      //Add Saved Links
      for (j = 2; j < (webview.length + 1); j++){
          var cell = content.insertCell(j-1);
          cell.innerHTML = `<webview style='height:100%' webpreferences='webviewTag' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0" src='` + webview[j - 2][0] + `'></webview>`;
          cell.style.width = '80%';
          cell.setAttribute('id', j);
      }
      //Add Buttons
      for (k = 2; k < (webview.length + 1); k++){
        buttons.innerHTML += `<tr><td align='center' class='navButton' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; width: 110px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 2][1] + `</td></tr>`
      }

      //Hide other webviews
      for (i = 2; i < (webview.length + 1); i++){
        $('#' + i).hide();
      }
    }

    currentPage = 1;

    document.getElementById('button1').className='navButtonSelected'

    setTimeout(updateChecker, 1000);
    setTimeout(mbLight, 1000);
    tgsnBot();
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
          }
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
  if (currentPage == 1){
    console.log('Skip for now will revisit later since Dashboard is special case');
  } else {
    if (sessionStorage.getItem('position') == 'Network Admin'){
      document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + adminView[parseInt(currentPage - 2)][0] + `'></webview>`;
    } else if (sessionStorage.getItem('position') == 'TVS Coordinator' || sessionStorage.getItem('position') == 'TGSN Coordinator'){
      document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + coordView[parseInt(currentPage - 2)][0] + `'></webview>`;
    } else {
      document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + webview[parseInt(currentPage - 2)][0] + `'></webview>`;
    }
  }
}

/*Push Notifications*/

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
