//Initialize Values
const changelog = db.collection("app").doc("changelog");
let changeLogHistory = document.getElementById('changeLogHistory')

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
