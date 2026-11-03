
var title = document.getElementById('title');
var body = document.getElementById('body');
var position = 0;

var titles = ['Welcome to the TGSN Staff App!', 'Permissions Issue?', 'Information', 'Upcoming Updates']
var bodies = ['Login with your Discord account to get started!', `If you aren't seeing the proper permissions, reach out to RampantEpsilon on Discord!`, `App Updates & More Will Appear Here!<br><br>`, `Release Calendar, Admin Tools, and more coming soon!`]

/* Add Custom Tiles */

//Get Current Date
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
if (year == 2026) {
  if (month == 11 || month == 10) {
    titles.push("Year-End Extravaganza '26");
    bodies.push("Taking Suggestions for YEE26! Reach out to RampantEpsilon with suggestions!");
  }
}

function change() {
  //Handle Fade Effect
  $("#title").fadeOut();
  $("#body").fadeOut();
  $("#body").promise().done(function () {
    title.innerHTML = titles[position];
    body.innerHTML = bodies[position];
    $("#title").fadeIn();
    $("#body").fadeIn();
  });

  if (position < (titles.length - 1)) {
    position += 1;
  } else {
    position = 0;
  }
}

setInterval(change, 10000);