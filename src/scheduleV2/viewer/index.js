const db = firebase.firestore();

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
    let currDate = year + '/' + month + '/' + day;

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
          dates[j] = eventDate + "<div align='center'><h3 align='right'>" + dow + ' ' + doc.data()[i].date + '</h3>' + doc.data()[i].time + '<br>' + doc.data()[i].preShow + '<br>' + doc.data()[i].show + '<br>' + doc.data()[i].game + "<br></div>";
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

getEvents();
