//Values for Events
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let startDay = 0;
//YEE
const yee = db.collection('schedule').doc('yee');

yee.onSnapshot(doc => {
    const data = doc.data();
    //console.log(data);

    for (i = 1; i > 32; i++) {
        document.getElementById(i).value = data[i];
    }

    //let startDay = document.getElementById('day-select').value

    //Build Layout for Screen capture
    let scheduleTable = '<table width="80%" align="center">'

    let day = 2;

    for (i in data) {
        document.getElementById(i).value = data[i];
        //console.log(data[i])
        if (data[i] != '') {
            scheduleTable += '<tr><td class="schedule-day" align="center">' + days[day] + ' 12/' + i + '</td><td>&nbsp;</td><td class="schedule-day">' + data[i] + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
        }
        if (day < 6) {
            day += 1;
        } else {
            day = 0;
        }
    }

    if (startDay === 'Sunday') {
    }
    else if (startDay === 'Monday') {
        startDay = 1;
    }
    else if (startDay === 'Tuesday') {
        startDay = 2;
    }
    else if (startDay === 'Wednesday') {
        startDay = 3;
    }
    else if (startDay === 'Thursday') {
        startDay = 4;
    }
    else if (startDay === 'Friday') {
        startDay = 5;
    }
    else if (startDay === 'Saturday') {
        startDay = 6;
    }

    document.getElementById('scheduledShows').innerHTML = scheduleTable + '</table>'
})

function updateSchedule() {
    const inputs = document.getElementsByClassName('text-box');
    let editValues = {};

    for (const input of inputs) {
        if (input.id) {
            editValues[input.id] = input.value;
        }
    }

    yee.set(editValues);
}

function downloadImg() {
    html2canvas(document.getElementById('scheduleBlock')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'schedule.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    })
}