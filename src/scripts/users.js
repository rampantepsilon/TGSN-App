var logins = [];

function init(){
  //Firebase variables
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins');

  //Other Variables
  var list = document.getElementById('userList');

  //Get Users & Info
  login.onSnapshot(doc => {
    const data = doc.data();

    var fNames = data.formatNames;
    var positions = data.position;
    var logos = data.logo;

    list.innerHTML = 'Current Users:'

    for (var j = 0; j < data.numUsers; j++){
      logins[j] = fNames[j].toLowerCase();
    }

    for (var i = 0; i < data.numUsers; i++){

      var position;
      if (positions[i] == 'Network Admin'){
        position = '0';
      } else if (positions[i] == 'TGSN Coordinator'){
        position = '1';
      } else if (positions[i] == 'TVS Coordinator'){
        position = '2';
      } else if (positions[i] == 'TGSN Staff'){
        position = '3';
      } else if (positions[i] == 'TVS Staff'){
        position = '4';
      } else if (positions[i] == 'DR Staff'){
        position = '5';
      } else {
        position = '3';
      }
      var pass = '"' + logins[i] + '", "' + position + '", "' + logos[i] + '"';
      console.log(pass);

      list.innerHTML += `<div style='height:70px' onclick='update(` + pass + `)'><img src='` + logos[i] + `' width='60px' height='60px' style='position:absolute'><div style='position:relative; left: 65px; top: 0px; width: 300px;'>` + fNames[i] + `<br>` + positions[i] + `</div></div>`;
    }
  })
}

function update(username, position2, logo){
  //Set up fields
  var uName = document.getElementById('uName');
  var pWord = document.getElementById('pWord');
  var avatar = document.getElementById('avatar');
  var position = document.getElementById('position');

  uName.value = '';
  avatar.value = '';
  position.selectedIndex = "-1";

  uName.value = username;
  pWord.disabled = false;
  avatar.value = logo;
  avatar.disabled = false;
  position.selectedIndex = position2;
  position.disabled = false;
}

function updateUser(){
  //Firebase variables
  const app = firebase.app();
  const db = firebase.firestore();
  const login = db.collection('users').doc('logins');

  //Set up fields
  var uName = document.getElementById('uName').value;
  var pWord = document.getElementById('pWord').value;
  var avatar = document.getElementById('avatar').value;
  var position = document.getElementById('position').value;

  if (pWord){
    alert("This will change the user's password. Please notify them of the change.");
    login.update({
      [uName]: pWord
    })
  }
  if (avatar){
    var index;
    for (var i = 0; i < logins.length; i++){
      if (uName == logins[i]){
        index = "logo." + i;
      }
    }
    login.update({
      [index]: avatar
    })
  }
  if (position){
    var index;
    for (var i = 0; i < logins.length; i++){
      if (uName == logins[i]){
        index = "position." + i;
      }
    }
    login.update({
      [index]: position
    })
  }
  clrUpdate();
}

function clrUpdate(){
  //Set up fields
  var uName = document.getElementById('uName');
  var pWord = document.getElementById('pWord');
  var avatar = document.getElementById('avatar');
  var position = document.getElementById('position');

  uName.value = '';
  avatar.value = '';
  position.selectedIndex = "-1";
  pWord.disabled = true;
  avatar.disabled = true;
  position.disabled = true;
}
