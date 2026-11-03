//Initialize Values
const tgsArticles = db.collection('tgs').doc('articles');
const tgsrVideos = db.collection('tgsr').doc('videos');

tgsArticles.onSnapshot(doc => {
  const data = doc.data();
  var link = data.link;
  var staffLink = data.staffLink;
  var length = data.link.length;
  var trunc = length - 5;

  document.getElementById('editTGS').innerHTML = [`
          <tr>
            <td align='center' width='100%'>
              <div id='body'>Current TGS Articles: <font size='2'><a href='` + link + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + link.substring(35, trunc) + `</a></font><br>(Only the document part of the URL is shown here)<br>&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td align='center' id='body'>
              Enter the new link for TGS Articles:<input id='tgsArticleLink'><br>
              <button onclick='updateTGSArticles()'>Update Articles</button>
              <button onclick='clearTGSArticles()'>Clear Link Field</button>
            </td>
          </tr>`]
})

tgsrVideos.onSnapshot(doc => {
  const data = doc.data();
  var notes = data.notes;
  var length = data.notes.length;
  var trunc = length - 5;

  document.getElementById('editTGSR').innerHTML = [`
          <tr>
            <td align='center'>
              <div id='body'>Current TGSR Video Link:<br><font size='2'><a href='` + data.source + `' target='_blank'>` + data.source + `</a></font><br></div>
              <div id='body'>Current TGSR Notes:<br><font size='2'><a href='` + data.notes + `' target='_blank'>` + notes.substring(35, trunc) + `</a></font><br>(Only the document part of the URL is shown here)<br>&nbsp;</div>
          </tr>
          <tr>
            <td align='center>
              <div id='body' align='left'>Videos: <input type='text' id='v1'><br>
              Notes: <input type='text' id='v2'>
              <button onclick='changeVideos()'>Change Resources</button></div>
            </td>
          </tr>`]
})

//Update Viewer Facing TGS Articles
function updateTGSArticles() {
  const db = firebase.firestore();
  const tgsArticles = db.collection('tgs').doc('articles');

  var tgsArticleLink = "";
  if (document.getElementById('tgsArticleLink').value != "") {
    tgsArticleLink = document.getElementById('tgsArticleLink').value;
    tgsArticles.update({ link: tgsArticleLink });
  }
}

//Clear dialog box for TGS Articles
function clearTGSArticles() {
  document.getElementById('tgsArticleLink').value = "";
}

//Change Videos
function changeVideos() {
  var video1 = document.getElementById('v1').value;
  var video2 = document.getElementById('v2').value;

  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');

  if (video1 != "") {
    tgsrVideos.update({ source: video1 });
  }
  if (video2 != "") {
    tgsrVideos.update({ notes: video2 });
  }
}