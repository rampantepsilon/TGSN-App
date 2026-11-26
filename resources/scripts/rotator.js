
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
    special = doc.data().special;

    /* Add Custom Tiles */

    //Get Current Date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Grab from Special List

    for (i in special['year']) {
      if (special['year'][i] == year) {
        if (month >= parseInt(special['monthStart'][i]) && month <= parseInt(special['monthEnd'][i])) {
          titles.push(special['titles'][i])
          bodies.push(special['bodies'][i])
        }
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