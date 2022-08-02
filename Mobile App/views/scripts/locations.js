const app = firebase.app();
const db = firebase.firestore();

var links = {
  'userLinks':[
    'Schedule',
    'Message Board',
    'Twitch Bot Commands',
    'TGS Resources',
    'Releases',
    'TGSR Resources'
  ],
  'loggedInLinks':[
    'Twitch Dashboard',
    'VDO.Ninja Stream',
    'VDO.Ninja Viewer'
  ],
  'adminLinks':[
    'Schedule Editor',
    'User Management',
    'Show Resources Editor'
  ]
};
var locations = [
  './main.html',
  './messages/index.html',
  './commands/index.html',
  './shows/view/tgs.html',
  './releases/index.html',
  './shows/view/tgsr.html',
  'https://dashboard.twitch.tv/u/thegamingsaloonnetwork/stream-manager',
  'https://obs.ninja/?room=thegamingsaloonnetwork&hash=e588',
  'https://obs.ninja/?scene&room=thegamingsaloonnetwork&password=tgsnstaff2020',
  './scheduleV2/redirect.html',
  './users/redirect.html',
  './shows/admin/redirect.html'
]

//Add Menus
function addMenus(){
  for (var i = 0; i < links['userLinks'].length; i++){
    document.getElementById('buttons').innerHTML += `<tr><td class='button' valign='middle' style='backgroundColor:#333' v-on:click='navigate("` + i + `")' id='b`+ i +`'><div class='link'>` + links['userLinks'][i] + `</div></td></tr>`;
  }
  if (sessionStorage.getItem('menuAccess') == 'staff' || sessionStorage.getItem('menuAccess') == 'admin'){
    var linksTotal = links['userLinks'].length;
    document.getElementById('buttons').innerHTML += `<tr><td style='font-size:8px'>&nbsp;</td></tr>`;
    for (var i = 0; i < links['loggedInLinks'].length; i++){
      var j = i + linksTotal;
      if (i == 0){
        document.getElementById('buttons').innerHTML += `<tr><td class='button' valign='middle' style='backgroundColor:#333' id='b`+ j +`'><a href='https://dashboard.twitch.tv/u/thegamingsaloonnetwork/stream-manager' style='color:orange; text-decoration:none;'><div class='link'>` + links['loggedInLinks'][i] + `</div></a></td></tr>`;
      } else {
        document.getElementById('buttons').innerHTML += `<tr><td class='button' valign='middle' style='backgroundColor:#333' v-on:click='navigate("` + j + `")' id='b`+ j +`'><div class='link'>` + links['loggedInLinks'][i] + `</div></td></tr>`;
      }
    }
  }
  if ( sessionStorage.getItem('menuAccess') == 'admin'){
    var linksTotal = links['userLinks'].length + links['loggedInLinks'].length;
    document.getElementById('buttons').innerHTML += `<tr><td style='font-size:8px'>&nbsp;</td></tr>`;
    for (var i = 0; i < links['adminLinks'].length; i++){
      var j = i + linksTotal;
      document.getElementById('buttons').innerHTML += `<tr><td class='button' valign='middle' style='backgroundColor:#333' v-on:click='navigate("` + j + `")' id='b`+ j +`'><div class='link'>` + links['adminLinks'][i] + `</div></td></tr>`;
    }
  }

  const d = new Date();
  if (d.getDay() == '6'){
    document.getElementById('buttonFoot').innerHTML = "<a href='https://tgsnetwork.org/tgsarticles.html' target='_blank'>TGS Resources<br>(Popout)</a>";
    document.getElementById('buttonFoot').setAttribute('class','specialFoot');
  } else if (d.getDay() == '0'){
    document.getElementById('buttonFoot').innerHTML = "<a href='https://tgsnetwork.org/tgsrarticles.html' target='_blank'>TGSR Resources<br>(Popout)</a>";
    document.getElementById('buttonFoot').setAttribute('class','specialFoot');
  } else {
    document.getElementById('buttonFoot').innerHTML = 'TGSN Staff App by<br>RampantEpsilon';
    document.getElementById('buttonFoot').setAttribute('class','');
  }
}

function activeButton(location){
  if (sessionStorage.getItem('menuAccess') == 'staff'){
    var linksTotal = links['userLinks'].length + links['loggedInLinks'].length;;
    for (i = 0; i < linksTotal; i++){
      document.getElementById("b" + i).style.backgroundColor = '#000';
    }
  } else if (sessionStorage.getItem('menuAccess') == 'admin'){
    var linksTotal = links['userLinks'].length + links['loggedInLinks'].length + links['adminLinks'].length;
    for (i = 0; i < linksTotal; i++){
      document.getElementById("b" + i).style.backgroundColor = '#000';
    }
  } else {
    for (i = 0; i < links['userLinks'].length; i++){
      document.getElementById("b" + i).style.backgroundColor = '#000';
    }
  }
  document.getElementById("b" + location).style.backgroundColor = '#333';
}

var menuVariable = 1; // 0 = hidden; 1 = shown
addMenus();
activeButton(sessionStorage.getItem("currPage"));

function showHideMenu(){
  if (menuVariable == 0){
    $('#buttonsTable').show();
    $('#buttonFoot').show();
    document.getElementById('menuPic').setAttribute('src','./images/menuClosed.png')
    menuVariable = 1;
  } else {
    $('#buttonsTable').hide();
    $('#buttonFoot').hide();
    document.getElementById('menuPic').setAttribute('src','./images/menuOpen.png')
    menuVariable = 0;
  }
}

function radioSelect(){
  if (localStorage.getItem('min2Tray') == 'true'){
    document.getElementById('yes').checked = true;
    document.getElementById('no').checked = false;
  } else {
    document.getElementById('yes').checked = false;
    document.getElementById('no').checked = true;
  }
}
radioSelect();

document.getElementById('min2Tray').addEventListener('change', function(e) {
  let target = e.target;
  let result;
  switch (target.id){
    case 'yes':
      result = 'true';
      break;
    case 'no':
      result = 'false';
      break;
  }
  localStorage.setItem('min2Tray', result);
})
