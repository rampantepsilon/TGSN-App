// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBAF1jevSp8_E5Okk9z6sMi-t4eRS4N9DE",
    authDomain: "tgsn-site-v7.firebaseapp.com",
    databaseURL: "https://tgsn-site-v7.firebaseio.com",
    projectId: "tgsn-site-v7",
    storageBucket: "tgsn-site-v7.appspot.com",
    messagingSenderId: "565689666494",
    appId: "1:565689666494:web:fc488b17f5018f569547ef"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Twitch Commands
function loadCommands() {
    //Initialize Values
    const app = firebase.app();
    const db = firebase.firestore();
    const commands = db.collection('bot').doc('commands');

    commands.onSnapshot(doc => {
        const data = doc.data();
        var commandList = document.getElementById('commandList');

        var parent = commandList;
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild);
        }

        var list = [];
        for (var j = 0; j < data.list.length; j++) {
            list[j] = data.list[j];
        }

        list.sort();

        for (var i = 0; i < data.list.length; i++) {
            var row = commandList.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.innerHTML = '!' + list[i];
            cell2.innerHTML = data.commands[list[i]];
            cell1.setAttribute('class', 'commands')
            cell1.setAttribute('width', '40%')
            cell2.setAttribute('class', 'commands')
        }
    });
}

function addCommand() {
    //Initialize Values
    const app = firebase.app();
    const db = firebase.firestore();
    const commands = db.collection('bot').doc('commands');

    var command = document.getElementById('command').value;
    var response = document.getElementById('response').value;

    commands.update({
        list: firebase.firestore.FieldValue.arrayUnion(command)
    });

    commands.set({
        commands: { [command]: response }
    }, {
        merge: true,
    })
}

function remCommand() {
    //Initialize Values
    const app = firebase.app();
    const db = firebase.firestore();
    const commands = db.collection('bot').doc('commands');
    var command = document.getElementById('command').value;

    commands.set({
        commands: {
            [command]: firebase.firestore.FieldValue.delete()
        }
    }, { merge: true });

    commands.onSnapshot(doc => {
        const data = doc.data();
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i] == command) {
                commands.update({
                    list: firebase.firestore.FieldValue.arrayRemove(command)
                });
            }
        }
    });
}

//Resource Loader
function showTGSArticlesUser() {
    //Initialize Values
    const app = firebase.app();
    const db = firebase.firestore();
    const tgsArticles = db.collection('tgs').doc('articles');
    const tgsrVideos = db.collection('tgsr').doc('videos');
    tgsArticles.onSnapshot(doc => {
        const data = doc.data();
        var link = data.link;
        var staffLink = data.staffLink;
        var length = data.link.length;
        var trunc = length - 5;

        document.getElementById('tgsResources').innerHTML = [`
              <div id='body'>Current TGS Articles: <font size='2'><a href='` + link + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + link.substring(35, trunc) + `</a></font><br>(Only the document part of the URL is shown here)<br>&nbsp;</div>`]
    })
    tgsrVideos.onSnapshot(doc => {
        const data = doc.data();
        var notes = data.notes;
        var length = data.notes.length;
        var trunc = length - 5;

        document.getElementById('tgsrResources').innerHTML = [`
              <div id='body'>Current TGSR Video Link:<br><font size='2'><a href='` + data.source + `' target='_blank'>` + data.source + `</a></font><br></div>
              <div id='body'>Current TGSR Notes:<br><font size='2'><a href='` + data.notes + `' target='_blank'>` + notes.substring(35, trunc) + `</a></font><br>(Only the document part of the URL is shown here)<br>&nbsp;</div>`]
    })
}

//Timed Messages
const db = firebase.firestore();
const rotator = db.collection('bot').doc('rotator');
var messageList = []
var messageID;

function getTimedMessages() {
    //Update messages
    rotator.onSnapshot(doc => {
        //console.log('Rotator Updated : ' + doc.data().main)
        messageLength = doc.data().main.length;
        for (var i = 0; i < doc.data().main.length; i++) {
            messageList[i] = doc.data().main[i];
            if (i == 0) {
                document.getElementById('currentMessages').innerHTML = ''
            }
            //document.getElementById('currentMessages').innerHTML += "<li onclick='selMessage(" + i + ")'>" + doc.data().main[i] + "</li>"
            document.getElementById('currentMessages').innerHTML += "<li onclick='selMessage(" + i + ")'>" + doc.data().main[i] + "</li>"
        }
    }, err => {
        console.log('Encountered error: ${err}');
    });
}

function addMessage() {
    //Get Message Content
    var messageToAdd = document.getElementById('message').value;

    rotator.update({
        main: firebase.firestore.FieldValue.arrayUnion(messageToAdd)
    });

    document.getElementById('message').value = ''
}

function selMessage(id) {
    //Add Clicked Message to Value for editing
    document.getElementById('message').value = messageList[id]
    messageID = id; //Used only for Editing
}

function delMessage() {
    var messageToDel = document.getElementById('message').value;

    rotator.update({
        main: firebase.firestore.FieldValue.arrayRemove(messageToDel)
    })

    document.getElementById('message').value = ''
}

function editMessage() {
    // Get Original Message to delete
    var originalMessage = messageList[messageID]

    rotator.update({
        main: firebase.firestore.FieldValue.arrayRemove(originalMessage)
    })

    addMessage();
}

//Releases
function todaysReleases() {
    const db = firebase.firestore();
    const releases = db.collection('releases').doc('cache');

    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0]
    let now = formatDate(today);

    releases.get().then((doc => {
        const data = doc.data();
        console.log(data)
        if (data.date != now) {
            if (!data.list) {
                let apiReturn = fetchToday();
                console.log(apiReturn)
                let gameList = [];
                for (i in apiReturn) {
                    gameList[i] = { name: apiReturn[i].name, platforms: [] };
                }
                releases.set({
                    date: formatDate(today),
                    list: gameList
                }, { merge: true });
            }
        }
    }))
}

//Update Check
function checkForUpdates() {
    const db = firebase.firestore();
    const updates = db.collection('app').doc('changelog');

    let changeList = document.getElementById('updatePanel');

    updates.get().then((doc => {
        const data = doc.data();
        //console.log(data);
        //console.log(Object.keys(data))
        //console.log(window.NL_APPVERSION)

        for (i in Object.keys(data)) {
            if (window.NL_APPVERSION >= Object.keys(data)[i]) {
                break;
            } else {
                for (j in data[i]['changes']) {
                    if (j == 0) {
                        changeList.innerHTML += (data[i]['changes'][j])
                    } else {
                        changeList.innerHTML += " | " + (data[i]['changes'][j])
                    }
                }
                document.getElementById('updateBlock').style.display = 'table-row'
            }
        }
    }))
}