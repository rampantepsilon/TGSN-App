//Variables
let currentPage = 1;
var defaultScript;

//Redirect Function
function showWin(num){
    if (num == 'edit'){
        for (i = 1; i < (webview.length + 1); i++){
            $('#' + i).hide();
            document.getElementById('button'+i).style.backgroundColor = 'lightblue';
            document.getElementById('button'+i).style.color = 'black';
        }
        $('#' + (webview.length+1)).show()
        currentPage = webview.length + 1;
    } else {
        for (i = 1; i < (webview.length + 2); i++){
            $('#' + i).hide();
        }
        $('#' + num).show()
        for (j = 1; j < (webview.length + 1); j++){
            if (j != num){
                document.getElementById('button' + j).style.backgroundColor = 'lightblue';
                document.getElementById('button' + j).style.color = 'black';
            } else {
                document.getElementById('button' + num).style.backgroundColor = 'blue';
                document.getElementById('button' + num).style.color = 'white';
            }
        }
        currentPage = num;
    }
}

//Hide All Windows Except the main on load
function init(){
    var content = document.getElementById('content');
    var buttons = document.getElementById('buttons');
    var uName = document.getElementById('uNameStatic');

    //Add Saved Links
    for (j = 1; j < (webview.length + 1); j++){
        var cell = content.insertCell(j - 1);
        cell.innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + webview[j - 1][0] + `'></webview>`;
        cell.style.width = '100%';
        cell.setAttribute('id', j);
    }

    for (k = 1; k < (webview.length + 1); k++){
        if (k == 1){
            buttons.innerHTML += `<td align='center' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; background-color: blue; color: white; width: 100px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 1][1] + `</td>`
        } else {
            buttons.innerHTML += `<td align='center' id='button` + k + `' style='border-style: outset; border-radius: 25% 25% 25% 25%; background-color: lightblue; width: 100px; height: 50px;' onclick="showWin('` + k + `')">` + webview[k - 1][1] + `</td>`
        }
    }

    for (i = 1; i < (webview.length + 1); i++){
        if (i != 1){
            $('#' + i).hide();
        }
    }

    //Login Functions
    var sUser = sessionStorage.getItem('username');
    var sLogo = sessionStorage.getItem('logo');
    if (sUser){
      document.getElementById('uNameStatic').innerHTML = sUser + `<br><button onclick='changePass()'>Change Password</button><button onclick='logout()'>Logout</button>`;
      document.getElementById('userPic').innerHTML = `<img src='` + sLogo + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`
    } else {
      uName.innerHTML = `Not Signed In<br><button onclick='login()'>Login</button>`
    }
}

//Login (WIP)
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
  var pWord = document.getElementById('pWord').value;
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')

  login.onSnapshot(doc => {
    const users = doc.data();
    var userNames = users['formatNames'];

    if (users[uName]){
      if (users[uName] == pWord){
        document.getElementById('loginError').innerHTML = 'Login Successful';
        document.getElementById('myModal').style.display = 'none';

        //Update User Fields
        for (var j = 0; j < userNames.length; j++){
          if (uName == userNames[j].toLowerCase()){
            document.getElementById('uNameStatic').innerHTML = userNames[j] + `<br><button onclick='changePass()'>Change Password</button><button onclick='logout()'>Logout</button>`;
            document.getElementById('userPic').innerHTML = `<img src='` + users['logo'][j] + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`
            //Set Storage
            sessionStorage.setItem('username', userNames[j])
            sessionStorage.setItem('logo', users['logo'][j])
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
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('logo');
  var uName = document.getElementById('uNameStatic');
  uName.innerHTML = `Not Signed In<br><button onclick='login()'>Login</button>`
  document.getElementById('userPic').innerHTML = '';
}
function changePass(){
  var modal = document.getElementById('passModal');
  var span = document.getElementsByClassName('close')[1];

  var oldPass = document.getElementById('oldPass');
  var newPass = document.getElementById('newPass');
  var confirmPass = document.getElementById('confirmPass');
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

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
  oldPass.focus();
}
function upd8Pass(){
  var oldPass = document.getElementById('oldPass').value;
  var newPass = document.getElementById('newPass').value;
  var confirmPass = document.getElementById('confirmPass').value;
  var user = sessionStorage.getItem('username').toLowerCase();
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins')

  login.onSnapshot(doc => {
    const users = doc.data();

    if (newPass.length > 6){
      if (confirmPass == newPass){
        if (users[user] == oldPass){
          document.getElementById('passError').innerHTML = "Password Changed";
          login.update({
            [user]: newPass
          })
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
  })
}

//Refresh Page
function refresh(){
    if (currentPage == (webview.length + 1)){
        document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" src='linkEditor.html'></webview>`
    } else {
        document.getElementById(currentPage).innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" allowpopups src='` + webview[parseInt(currentPage - 1)][0] + `'></webview>`;
    }
}
