//Initalize Values
const builder = db.collection('schedule').doc('v4');
let monEdit = document.getElementById('monday');
let tueEdit = document.getElementById('tuesday');
let wedEdit = document.getElementById('wednesday');
let thuEdit = document.getElementById('thursday');
let friEdit = document.getElementById('friday');
let satEdit = document.getElementById('saturday');
let sunEdit = document.getElementById('sunday');

builder.onSnapshot(doc => {
    const data = doc.data();
    console.log(data);

    //Put values in editor
    monEdit.value = data.monday;
    tueEdit.value = data.tuesday;
    wedEdit.value = data.wednesday;
    thuEdit.value = data.thursday;
    friEdit.value = data.friday;
    satEdit.value = data.saturday;
    sunEdit.value = data.sunday;

    //Build Layout for Screen capture
    let scheduleTable = '<table width="80%" align="center">'

    if (data.monday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Monday</td><td>&nbsp;</td><td class="schedule-day">' + data.monday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.tuesday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Tuesday</td><td>&nbsp;</td><td class="schedule-day">' + data.tuesday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.wednesday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Wednesday</td><td>&nbsp;</td><td class="schedule-day">' + data.wednesday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.thursday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Thursday</td><td>&nbsp;</td><td class="schedule-day">' + data.thursday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.friday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Friday</td><td>&nbsp;</td><td class="schedule-day">' + data.friday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.saturday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Saturday</td><td>&nbsp;</td><td class="schedule-day">' + data.saturday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }
    if (data.sunday != '') {
        scheduleTable += '<tr><td class="schedule-day" align="center">Sunday</td><td>&nbsp;</td><td class="schedule-day">' + data.sunday + '</td></tr><tr><td colspan="3" style="font-size:8px">&nbsp;</td></tr>'
    }

    document.getElementById('scheduledShows').innerHTML = scheduleTable + '</table>'
})

function updateSchedule() {
    let monday = monEdit.value
    let tuesday = tueEdit.value
    let wednesday = wedEdit.value
    let thursday = thuEdit.value
    let friday = friEdit.value
    let saturday = satEdit.value
    let sunday = sunEdit.value

    builder.set({
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
    })
}

function downloadImg() {
    html2canvas(document.getElementById('scheduleBlock')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'schedule.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    })
}