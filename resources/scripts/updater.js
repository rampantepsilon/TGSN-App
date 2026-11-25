//Initialize Values
const changelog = db.collection("app").doc("changelog");
let changeLogHistory = document.getElementById('changeLogHistory')

const rotatorFB = db.collection('app').doc('rotator');
let rotatorList = document.getElementById('rotatorList')

changelog.onSnapshot(doc => {
    const data = doc.data();
    //console.log(data);

    let keys = Object.keys(data).reverse()
    let history = document.getElementById("changelogHistory");
    history.innerHTML = ''

    for (i in keys) {
        let releaseLink;

        if (data[keys[i]]['releaseLink']) {
            releaseLink = data[keys[i]]['releaseLink']
        } else {
            releaseLink = 'https://github.com/rampantepsilon/TGSN-App/releases'
        }

        history.innerHTML += "<p align='center'><a href='" + releaseLink + "' target='_blank'><u>v" + data[keys[i]]['versionName'] + "</a></u></p>";

        for (j in data[keys[i]]['changes']) {
            history.innerHTML += data[keys[i]]['changes'][j] + "<br>"
        }
    }
})

rotatorFB.onSnapshot(doc => {
    const data = doc.data();
    rotatorList.innerHTML = `<h3 align="center"><u>Current Rotator Messages</u></h3>`

    for (i in data['titles']) {
        rotatorList.innerHTML += "<span style='font-size:14px;'>" + data['titles'][i] + "</span><br><span style='font-size:12px;'>" + data['bodies'][i] + "</span><br><br>"
    }
})

function updateLog() {
    let versionName = document.getElementById('versionName').value;
    let versionBase = document.getElementById('versionBase').value;
    let changes = document.getElementById('changes').value.split('\n');
    let buildDate = new Date().toLocaleDateString('en-CA', 'America/New_York').split("-").join("");
    let versionType = document.querySelector('input[name="versionType"]:checked').value
    let releaseLink

    if (document.getElementById('releaseLink').value == "") {
        releaseLink = document.getElementById('releaseLink').value
    } else {
        releaseLink = 'https://github.com/rampantepsilon/TGSN-App/releases'
    }

    let updateData = {
        [buildDate]: {
            'versionBase': versionBase,
            'versionName': versionName,
            'changes': changes,
            'buildType': versionType,
            'releaseLink': releaseLink
        }
    }

    changelog.set(updateData, { merge: true })
}

function addRotator() {
    let title = document.getElementById('rotatorTitle').value;
    let message = document.getElementById('rotatorMsg').value;

    rotatorFB.set({
        titles: firebase.firestore.FieldValue.arrayUnion(title),
        bodies: firebase.firestore.FieldValue.arrayUnion(message),
    }, { merge: true })
}

function remRotator() {
    let title = document.getElementById('rotatorTitle').value;

    rotatorFB.get().then((doc) => {
        let titles = doc.data().titles
        let bodies = doc.data().bodies
        console.log(titles)
        let indexToRemove = -1;

        for (i in titles) {
            console.log(titles[i])
            if (titles[i] == title) {
                indexToRemove = i;
            }
        }

        if (indexToRemove > -1 && indexToRemove < titles.length) {
            titles.splice(indexToRemove, 1)
            bodies.splice(indexToRemove, 1)

            return rotatorFB.update({
                titles: titles,
                bodies: bodies
            });
        } else {
            console.log('No Entry Found')
        }
    })
}