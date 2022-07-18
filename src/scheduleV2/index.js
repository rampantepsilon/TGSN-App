const db = firebase.firestore();
const schedule = db.collection('schedule').doc('v3');
var currID;
schedule.onSnapshot((doc) => {
  document.getElementById("id").value = doc.data().length
  currID = doc.data().length;
})

//Day of week array
const weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

async function setEvents(){
  var id = document.getElementById('id').value;
  var date = document.getElementById('date').value;
  date = date.substr(5,2) + '/' + date.substr(8,2) + '/' + date.substr(0,4);
  var start = document.getElementById('sTime').value;
  var preshow = document.getElementById('pShow').value;
  var show = document.getElementById('show').value;
  var game = document.getElementById('game').value;

  //Convert Time to 12H format
  var startH, startM;
  startH = parseInt(start.substr(0,2));
  if (startH == 12){
    startM = start.substr(2,3) + " PM EST";
  } if (startH > 12){
    startH = startH - 12;
    startM = start.substr(2,3) + " PM EST";
  } if (startH == 00){
    startH = 12;
    startM = start.substr(2,3) + " AM EST";
  }
  start = startH + startM;

  if (!document.getElementById('date').value){
    alert("Please Enter A Date To Continue Adding")
    return;
  }
  if (!start){
    start = 'N/A'
  }
  if (!game){
    if (show == 'No Stream'){
      game = 'N/A'
    } else {
      alert("Game Cannot Be Blank")
      return;
    }
  }
  var fBaseData = {
    [id]: {
      date: date,
      time: start,
      preShow: preshow,
      show: show,
      game: game
    }
  }

  schedule.update(fBaseData)
  if (id == currID){
    var newID = parseInt(id) + 1;
    schedule.update({length: newID})
  }
}

async function getEvents(){
  db.collection('schedule').doc('v3').onSnapshot((doc) => {
    document.getElementById('upcomingEvents').innerHTML = ``
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let currDate = month + '/' + day + '/' + year;

    var dates = [];
    var j = 0;

    for (var i = 0; i < doc.data().length; i++){
      if (doc.data()[i]){
        //Calc Day of Week
        const d2 = new Date(doc.data()[i].date);
        let dow = weekday[d2.getDay()]

        let eventDate = doc.data()[i].date.substr(6,4) + '/' + doc.data()[i].date.substr(0,2) + '/' + doc.data()[i].date.substr(3,2)

        const zeroPad = (num, places) => String(num).padStart(places, '0');

        //Add to list for sorting
        dates[j] = eventDate + `<div align='center' id='fb` + i + `' onclick='edit(` + i + `)'><h3 align='right'>` + dow + ' ' + doc.data()[i].date + '</h3>' + doc.data()[i].time + '<br>' + doc.data()[i].preShow + '<br>' + doc.data()[i].show + '<br>' + doc.data()[i].game + "<br>ID: " + i + "<br></div>";
        j++;
      }
    }
    dates.sort();
    for (var i = 0; i < dates.length; i++){
      document.getElementById('upcomingEvents').innerHTML += dates[i].substr(10);
    }
    filter();
  })
}

getEvents();

function edit(num){
  document.getElementById('id').value = num;
  db.collection('schedule').doc('v3').onSnapshot((doc) => {
    //Convert Date to input
    var date = doc.data()[num].date;
    date = date.substr(6,4) + '-' + date.substr(0,2) + '-' + date.substr(3,2);
    document.getElementById('date').value = date;

    //Convert Time to input
    let time = doc.data()[num].time;
    let colPos = time.indexOf(":");
    let timeSplit = time.split(' ');

    if (timeSplit[1] == 'PM'){
    	//Calc length
        var colLen = colPos - 0;
    	time = (parseInt(time.substr(0, colLen)) + 12) + time.substr(colPos, 3);
    } else {
    	var colLen = colPos - 0;
    	if (time.substr(0, colLen) == '12'){
        	time = '0' + (parseInt(time.substr(0, colLen)) - 12) + time.substr(colPos, 3);
        } else {
        	if (parseInt(time.substr(0, colLen)) < 10){
            	time = '0' + time.substr(0, colLen) + time.substr(colPos, 3);
            } else {
        		time = time.substr(0, colLen) + time.substr(colPos, 3);
            }
        }
    }
    document.getElementById('sTime').value = time;
    document.getElementById('pShow').value = doc.data()[num].preShow;
    document.getElementById('show').value = doc.data()[num].show;
    document.getElementById('game').value = doc.data()[num].game;
  })
}

function removeEntry(){
  var delID = document.getElementById('id').value;
  db.collection('schedule').doc('v3').update({
    [delID]: firebase.firestore.FieldValue.delete()
  })
}
