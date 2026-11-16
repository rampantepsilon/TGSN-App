
var title = document.getElementById('title');
var body = document.getElementById('body');
var position = 0;

let titles;
let bodies;

const rotatorFirestore = db.collection('app').doc('rotator');

rotatorFirestore.onSnapshot(doc => {
  if (doc.exists) {
    titles = doc.data().titles;
    bodies = doc.data().bodies;

    /* Add Custom Tiles */

    //Get Current Date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    if (year == 2026) {
      if (month == 11 || month == 10) {
        titles.push("Year-End Extravaganza '26");
        bodies.push("Schedule is completed! See it on Discord in the Year-End Extravaganza 26 chat!");
      }
    }
  } else {
    console.log("Document 'rotator' does not exist.");
  }
});

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