//Firebase Constants
const fb = firebase.app();
const db = firebase.firestore();
const login = db.collection('users').doc('logins');
const timestamp = db.collection('users').doc('timestamp');
var id;

//Set id
db.collection('app').doc('data').onSnapshot((doc) => {
  id = doc.data().id;
})

dashInit();

function dashInit(){
  var content = document.getElementById('dashContent');

  content.innerHTML = [`
    <table width='100%'>
      <tr>
        <td align='center'>
          <h4 align='center'><u>Schedule</u><br><a href='https://twitch.tv/thegamingsaloonnetwork' target="_blank">Watch on Twitch</a></h4>
          <div id='upcomingEvents'></div>
        </td>
      </tr>
      <tr>
        <td style='background-color:rgba(0,0,0,0.5)'>
        </td>
      </tr>
    </table>
    <br>
  `]
}

//Day of week array
const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

async function getEvents(){
  db.collection('schedule').doc('v3').onSnapshot((doc) => {
    document.getElementById('upcomingEvents').innerHTML = ''
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let currDate;
    if (month < 10){
      month = "0" + month;
    }
    if (day < 10){
      currDate = year + '/' + month + '/0' + day;
    } else {
      currDate = year + '/' + month + '/' + day;
    }

    var dates = [];
    var j = 0;

    for (var i = 0; i < doc.data().length; i++){
      if (doc.data()[i]){
        let eventDate = doc.data()[i].date.substr(6,4) + '/' + doc.data()[i].date.substr(0,2) + '/' + doc.data()[i].date.substr(3,2)
        if (eventDate >= currDate){
          //Calc Day of Week
          const d2 = new Date(doc.data()[i].date);
          let dow = weekday[d2.getDay()]

          //Add to list for sorting
          dates[j] = eventDate + "<div align='center' style='width: 75%'><h5 align='right' style='background-color: rgba(0, 0, 0, 0.5); color: white; text-shadow: 2px 2px black; padding-right: 4px;'>" + dow + ' ' + doc.data()[i].date + '</h5>' + doc.data()[i].time + '<br>' + doc.data()[i].preShow + '<br>' + doc.data()[i].show + '<br>' + doc.data()[i].game + "<br></div>";
          j++;
        }
      }
    }
    dates.sort();
    for (var i = 0; i < dates.length; i++){
      document.getElementById('upcomingEvents').innerHTML += dates[i].substr(10);
    }
  })
}

function checkTime(){
    const d = new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    if (hour == 0){
      if (minute < 1){
        getEvents();
      }
    }
}

setInterval(checkTime, 60000);
getEvents();
