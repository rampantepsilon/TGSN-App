//Load Schedule
function loadSchedule(){
  //Initialize Values
  const app = firebase.app();
  const db = firebase.firestore();
  const schedule = db.collection('schedule').doc('new');

  //Get Schedule & Dates

  schedule.onSnapshot(doc => {
    const day = doc.data();

    //Fill dates
    var startMonth = day.week[0];
    var startDay = day.week[1];
    var endMonth = day.week[2];
    var endDay = day.week[3];
    var weekDays = [];
    var dayCalc;
    var newMonthCounter = 0;

    if (startMonth == endMonth){
      for (i=0; i < 7; i++){
        weekDays[i] = (parseInt(startDay)+parseInt(i));
      }
      //Add Dates to schedule
      $('#mDate').html(startMonth + '/' + weekDays[0]);
      $('#tuDate').html(startMonth + '/' + weekDays[1]);
      $('#wDate').html(startMonth + '/' + weekDays[2]);
      $('#thDate').html(startMonth + '/' + weekDays[3]);
      $('#fDate').html(startMonth + '/' + weekDays[4]);
      $('#saDate').html(startMonth + '/' + weekDays[5]);
      $('#suDate').html(startMonth + '/' + weekDays[6]);
    }
    if (startMonth != endMonth){
      if (parseInt(startMonth) == 4 || parseInt(startMonth) == 6 || parseInt(startMonth) == 9 || parseInt(startMonth) == 11){
        //Get Amount of Days before month change
        dayCalc = 31 - parseInt(startDay);

        //Add Current Month
        for (i = 0; i < dayCalc; i++){
          weekDays[i] = startMonth + '/' + (parseInt(startDay)+parseInt(i));
        }

        //Add New Month
        for (j = weekDays.length; j < 7; j++){
          weekDays[j] = endMonth + '/' + (1 + parseInt(newMonthCounter));
          newMonthCounter++;
        }

        //Add Dates to schedule
        $('#mDate').html(weekDays[0]);
        $('#tuDate').html(weekDays[1]);
        $('#wDate').html(weekDays[2]);
        $('#thDate').html(weekDays[3]);
        $('#fDate').html(weekDays[4]);
        $('#saDate').html(weekDays[5]);
        $('#suDate').html(weekDays[6]);
      }

      if (parseInt(startMonth) == 1 || parseInt(startMonth) == 3 || parseInt(startMonth) == 5 || parseInt(startMonth) == 7 || parseInt(startMonth) == 8 || parseInt(startMonth) == 10 || parseInt(startMonth) == 12){
        //Get Amount of Days before month change
        dayCalc = 32 - parseInt(startDay);

        //Add Current Month
        for (i = 0; i < dayCalc; i++){
          weekDays[i] = startMonth + '/' + (parseInt(startDay)+parseInt(i));
        }

        //Add New Month
        for (j = weekDays.length; j < 7; j++){
          weekDays[j] = endMonth + '/' + (1 + parseInt(newMonthCounter));
          newMonthCounter++;
        }

        //Add Dates to schedule
        $('#mDate').html(weekDays[0]);
        $('#tuDate').html(weekDays[1]);
        $('#wDate').html(weekDays[2]);
        $('#thDate').html(weekDays[3]);
        $('#fDate').html(weekDays[4]);
        $('#saDate').html(weekDays[5]);
        $('#suDate').html(weekDays[6]);
      }

      if (parseInt(startMonth) == 2){
        //Get Amount of Days before month change
        dayCalc = 29 - parseInt(startDay);

        //Add Current Month
        for (i = 0; i < dayCalc; i++){
          weekDays[i] = startMonth + '/' + (parseInt(startDay)+parseInt(i));
        }

        //Add New Month
        for (j = weekDays.length; j < 7; j++){
          weekDays[j] = endMonth + '/' + (1 + parseInt(newMonthCounter));
          newMonthCounter++;
        }

        //Add Dates to schedule
        $('#mDate').html(weekDays[0]);
        $('#tuDate').html(weekDays[1]);
        $('#wDate').html(weekDays[2]);
        $('#thDate').html(weekDays[3]);
        $('#fDate').html(weekDays[4]);
        $('#saDate').html(weekDays[5]);
        $('#suDate').html(weekDays[6]);
      }
    }

    //Fill Monday Fields
    $('#mTime').html(day.monday[0]);
    $('#mPShow').html(day.monday[1]);
    $('#mShow').html(day.monday[2] + "<br>(" + day.monday[3] + ")");

    //Fill Tuesday Fields
    $('#tuTime').html(day.tuesday[0]);
    $('#tuPShow').html(day.tuesday[1]);
    $('#tuShow').html(day.tuesday[2] + "<br>(" + day.tuesday[3] + ")");

    //Fill Wednesday Fields
    $('#wTime').html(day.wednesday[0]);
    $('#wPShow').html(day.wednesday[1]);
    $('#wShow').html(day.wednesday[2] + "<br>(" + day.wednesday[3] + ")");

    //Fill Thursday Fields
    $('#thTime').html(day.thursday[0]);
    $('#thPShow').html(day.thursday[1]);
    $('#thShow').html(day.thursday[2] + "<br>(" + day.thursday[3] + ")");

    //Fill Friday Fields
    $('#fTime').html(day.friday[0]);
    $('#fPShow').html(day.friday[1]);
    $('#fShow').html(day.friday[2] + "<br>(" + day.friday[3] + ")");

    //Fill Saturday Fields
    $('#saTime').html(day.saturday[0]);
    $('#saPShow').html(day.saturday[1]);
    $('#saShow').html(day.saturday[2] + "<br>(" + day.saturday[3] + ")");

    //Fill Sunday Fields
    $('#suTime').html(day.sunday[0]);
    $('#suPShow').html(day.sunday[1]);
    $('#suShow').html(day.sunday[2] + "<br>(" + day.sunday[3] + ")");
  })

  //Update on Enter
  $("#sTime").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#pShow").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#game").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#wosm").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#wosd").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#woem").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });
  $("#woed").keyup(function(event){
    if (event.keyCode === 13){
      $("#ud8Schedule").click();
    }
  });

  setTimeout(`highlightToday();`,1700);
}
//Highlight Today
function highlightToday(){
  //Highlight Current Day
  var d = new Date();
  var month = (d.getMonth() + 1);
  var date = d.getDate();
  var fullDate = month + '/' + date;
  var hDay = d.getDay();

  if (hDay == 0){
    document.getElementById('saturday').style.backgroundColor = '';
    if (fullDate == document.getElementById('suDate').innerHTML){
      document.getElementById('sunday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 1){
    document.getElementById('sunday').style.backgroundColor = '';
    if (fullDate == document.getElementById('mDate').innerText){
      document.getElementById('monday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 2){
    document.getElementById('monday').style.backgroundColor = '';
    if (fullDate == document.getElementById('tuDate').innerText){
      document.getElementById('tuesday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 3){
    document.getElementById('tuesday').style.backgroundColor = '';
    if (fullDate == document.getElementById('wDate').innerText){
      document.getElementById('wednesday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 4){
    document.getElementById('wednesday').style.backgroundColor = '';
    if (fullDate == document.getElementById('thDate').innerText){
      document.getElementById('thursday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 5){
    document.getElementById('thursday').style.backgroundColor = '';
    if (fullDate == document.getElementById('fDate').innerText){
      document.getElementById('friday').style.backgroundColor = 'gold';
    }
  }
  if (hDay == 6){
    document.getElementById('friday').style.backgroundColor = '';
    if (fullDate == document.getElementById('saDate').innerText){
      document.getElementById('saturday').style.backgroundColor = 'gold';
    }
  }
}

function edit(dayOfWeek){
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("close")[0];
  //Modal Open
  modal.style.display = 'block';
  //Close Function
  span.onclick = function() {
    document.getElementById('myModal').style.display = 'none';
  };

  //Load current information for day
  //Initialize Values
  const app = firebase.app();
  const db = firebase.firestore();
  const schedule = db.collection('schedule').doc('new');

  //Get Schedule & Dates

  schedule.onSnapshot(doc => {
    const day = doc.data();

    if (dayOfWeek == 'monday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Monday';
      document.getElementById('sTime').value = day.monday[0];
      document.getElementById('pShow').value = day.monday[1];
      document.getElementById('show').value = day.monday[2];
      document.getElementById('game').value = day.monday[3];
    }
    if (dayOfWeek == 'tuesday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Tuesday';
      document.getElementById('sTime').value = day.tuesday[0];
      document.getElementById('pShow').value = day.tuesday[1];
      document.getElementById('show').value = day.tuesday[2];
      document.getElementById('game').value = day.tuesday[3];
    }
    if (dayOfWeek == 'wednesday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Wednesday';
      document.getElementById('sTime').value = day.wednesday[0];
      document.getElementById('pShow').value = day.wednesday[1];
      document.getElementById('show').value = day.wednesday[2];
      document.getElementById('game').value = day.wednesday[3];
    }
    if (dayOfWeek == 'thursday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Thursday';
      document.getElementById('sTime').value = day.thursday[0];
      document.getElementById('pShow').value = day.thursday[1];
      document.getElementById('show').value = day.thursday[2];
      document.getElementById('game').value = day.thursday[3];
    }
    if (dayOfWeek == 'friday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Friday';
      document.getElementById('sTime').value = day.friday[0];
      document.getElementById('pShow').value = day.friday[1];
      document.getElementById('show').value = day.friday[2];
      document.getElementById('game').value = day.friday[3];
    }
    if (dayOfWeek == 'saturday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Saturday';
      document.getElementById('sTime').value = day.saturday[0];
      document.getElementById('pShow').value = day.saturday[1];
      document.getElementById('show').value = day.saturday[2];
      document.getElementById('game').value = day.saturday[3];
    }
    if (dayOfWeek == 'sunday'){
      //Fill Monday Fields
      document.getElementById('day').value = 'Sunday';
      document.getElementById('sTime').value = day.sunday[0];
      document.getElementById('pShow').value = day.sunday[1];
      document.getElementById('show').value = day.sunday[2];
      document.getElementById('game').value = day.sunday[3];
    }
    if (document.getElementById('pShow').value == '&nbsp;'){
      document.getElementById('pShow').value = '';
    }
  })
}

//Update Schedule from Modal
function updateSchedule(){
  const db = firebase.firestore();
  const tgsnSchedule = db.collection('schedule').doc('new');

  var day = document.getElementById('day').value;
  //var month = document.getElementById('mDate').value;
  //var date = document.getElementById('dDate').value;
  var time = document.getElementById('sTime').value;
  var preShow = document.getElementById('pShow').value;
  var show = document.getElementById('show').value;
  var game = document.getElementById('game').value;
  var wosm = document.getElementById('wosm').value;
  var wosd = document.getElementById('wosd').value;
  var woem = document.getElementById('woem').value;
  var woed = document.getElementById('woed').value;
  var post = [];

  if (wosm != '' && wosd != '' && woem != '' && woed != ''){
    tgsnSchedule.update({week: {[0]: wosm,[1]: wosd,[2]: woem,[3]: woed}});
  }

  if (time != ''){
    post[0] = time;
  }
  if (time == ''){
    post[0] = 'N/A';
  }
  if (preShow != ''){
    post[1] = preShow
  }
  if (preShow == ''){
    post[1] = '&nbsp;';
  }
  post[2] = show;
  if (game != ''){
    post[3] = game;
  }
  if (game == ''){
    post[3] = 'N/A';
  }
  //To Be Added In Next Update
  //post[4] = month + '/' + date;

  //Post to Database
  if (day == 'Monday'){
    tgsnSchedule.update({monday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Tuesday'){
    tgsnSchedule.update({tuesday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Wednesday'){
    tgsnSchedule.update({wednesday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Thursday'){
    tgsnSchedule.update({thursday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Friday'){
    tgsnSchedule.update({friday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Saturday'){
    tgsnSchedule.update({saturday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }
  if (day == 'Sunday'){
    tgsnSchedule.update({sunday: {[0]: post[0], [1]: post[1], [2]: post[2], [3]: post[3]}});
  }

  document.getElementById('myModal').style.display = 'none';
}
//for highlightToday()
var launch = 0;
var initCheck = 0;
function clock() {
    var hours = document.getElementById("hours");
    var minutes = document.getElementById("minutes");
    var seconds = document.getElementById("seconds");
    var phase = document.getElementById("phase");

    if (launch == 0){
      var d = new Date();
      var month = (d.getMonth() + 1);
      var date = d.getDate();
      var year = d.getFullYear();
      var fullDate = month + '/' + date + '/' + year;
      document.getElementById('date').innerHTML = fullDate;
      launch = 1;
    }

    var h = new Date().getHours();
    var m = new Date().getMinutes();
    var s = new Date().getSeconds();
    var am = "AM";

    if (h > 12) {
        h = h - 12;
        var am = "PM";
    }
    if (h == 0){
      if (initCheck == 0){
        highlightToday();
        var d = new Date();
        var month = (d.getMonth() + 1);
        var date = d.getDate();
        var year = d.getFullYear();
        var fullDate = month + '/' + date + '/' + year;
        document.getElementById('date').innerHTML = fullDate;
        initCheck = 1;
      }
    }
    if (h == 1){
      if (initCheck == 1){
        initCheck = 0;
      }
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    hours.innerHTML = h;
    minutes.innerHTML = m;
    seconds.innerHTML = s;
    phase.innerHTML = am;
}
var interval = setInterval(clock, 1000);
