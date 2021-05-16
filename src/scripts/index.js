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

    /*//Add Editor Silently
    var cell = content.insertCell(webview.length);
    cell.innerHTML = `<webview style='width:100%; height:100%' useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" src='linkEditor.html'></webview>`;
    cell.style.width = '100%';
    cell.setAttribute('id', webview.length + 1);*/

    for (i = 1; i < (webview.length + 1); i++){
        if (i != 1){
            $('#' + i).hide();
        }
    }

    uName.innerHTML = `Not Signed In<br><button onclick='login()'>Login</button>`
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
            document.getElementById('uNameStatic').innerHTML = userNames[j] + `<br><button onclick='logout()'>Logout</button>`;
            document.getElementById('userPic').innerHTML = `<img src='` + users['logo'][j] + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`
          }
        }

        //Set Storage
      } else {
        document.getElementById('loginError').innerHTML = 'Incorrect Password'
      }
    } else {
      console.log('User Fails')
      document.getElementById('loginError').innerHTML = 'User Does Not Exist. If this is an error, please contact RampantEpsilon on Discord.'
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
