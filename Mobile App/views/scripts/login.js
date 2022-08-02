function loginInit(){
  //Variables
  var content = document.getElementById('content');
  var buttons = document.getElementById('buttons');
  var uName = document.getElementById('uNameStatic');
  //Login Functions
  var sUser;
  if (sessionStorage.getItem('username')){
    sUser = sessionStorage.getItem('username')
  } else {
    sUser = '';
  }
  var sLogo = sessionStorage.getItem('logo');

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
  if (sPosition == 'Network Admin' || sPosition == 'TGSN Coordinator'){
    sessionStorage.setItem('menuAccess','admin')
  }
  if (sPosition == 'TGSN Staff' || sPosition == 'DR Staff'){
    sessionStorage.setItem('menuAccess','staff')
  }
  if (sUser){
    document.getElementById('uNameStatic').innerHTML = `<span style='font-size: 14px'>` + sUser + `</span><br><span style='font-size:12px'>` + sPosition + `</span>`;
    document.getElementById('loginButtons').innerHTML = `<div class='userEditButtons' onclick='changePass()'>Edit Profile</div><div class='userEditButtons' onclick='logout()'>Logout</div>`;
    document.getElementById('userPic').innerHTML = `<img src='` + sLogo + `' width='40' height='40' style='border-radius: 50% 50% 50% 50%;'>`
  } else {
    uName.innerHTML = `Not Signed In`
    document.getElementById('loginButtons').innerHTML = `<div class='userEditButtons' onclick='login()'>Login</div>`
  }
}

loginInit();

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
  var rMe = document.getElementById("rememberMe").checked;

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
            document.getElementById('uNameStatic').innerHTML = `<span style='font-size: 24px'>` + userNames[j] + `</span><br>` + users['position'][j];
            document.getElementById('loginButtons').innerHTML = `<div class='userEditButtons' onclick='changePass()'>Change Password</div><div class='userEditButtons' onclick='logout()'>Logout</div>`;
            document.getElementById('userPic').innerHTML = `<img src='` + users['logo'][j] + `' width='60px' height='60px' style='border-radius: 50% 50% 50% 50%;'>`;
            //Set Storage
            sessionStorage.setItem('username', userNames[j])
            sessionStorage.setItem('logo', users['logo'][j])
            sessionStorage.setItem('position', users['position'][j])
            localStorage.setItem('username', userNames[j])
            localStorage.setItem('logo', users['logo'][j])
            localStorage.setItem('position', users['position'][j])
            if (rMe = true){
              localStorage.setItem('rememberMe', 'yes');
            } else {
              localStorage.setItem('rememberMe', 'no');
            }
            if (users['position'][j] == 'Network Admin' || users['position'][j] == 'TGSN Coordinator'){
              sessionStorage.setItem('menuAccess', 'admin')
              localStorage.setItem('menuAccess', 'admin')
            }
            if (users['position'][j] == 'TGSN Staff' || users['position'][j] == 'DR Staff'){
              sessionStorage.setItem('menuAccess', 'staff')
              localStorage.setItem('menuAccess', 'staff')
            }
            var tsUName = userNames[j];
            var tsTime = new Date().toLocaleString();
            timestamp.update({
              [tsUName]: tsTime
            })
            location.reload();
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
  sessionStorage.removeItem('menuAccess');
  localStorage.removeItem('username');
  localStorage.removeItem('logo');
  localStorage.removeItem('position');
  localStorage.removeItem('menuAccess');
  localStorage.setItem('rememberMe', 'no')
  var uName = document.getElementById('uNameStatic');
  uName.innerHTML = `Not Signed In<br>`;
  document.getElementById('loginButtons').innerHTML = `<div class='userEditButtons' onclick='login()'>Login</div>`;
  document.getElementById('userPic').innerHTML = '';
  document.getElementById('buttons').innerHTML = '';
  sessionStorage.setItem('currPage',0);
  location.reload();
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

  radioSelect();

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
