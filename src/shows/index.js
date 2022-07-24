var playerWidth = window.innerWidth-50;
var playerHeight = window.innerHeight-85;

function showTGSArticlesUser(){
  //Initialize Values
  const app = firebase.app();
  const db = firebase.firestore();
  const tgsArticles = db.collection('tgs').doc('articles');

  //Get Articles Link
  tgsArticles.onSnapshot(doc => {
    const data = doc.data();
    var link = data.link;
    var staffLink = data.staffLink;
    var length = data.link.length;
    var trunc = length - 5;

    //Fill information
    document.getElementById('showBody').innerHTML = [`
      <table width='100%'>
        <tr>
          <td align='center' valign='top' colspan='3'>
            <h3><u>TGS Resources</u></h3>` +
            `<a href='./tgs.html' target='_blank'>Open in New Window</a>` +
          `</td>
        </tr>
        <tr>
          <td colspan='3' align='center'>
            <iframe src='` + link + `' id='articlesWin'></iframe>
          </td>
        </tr>
      </table>`]

    $('#articlesWin').css('width', playerWidth +'px');
    $('#articlesWin').css('height', playerHeight +'px');
  })
}
function showTGSArticles(){
  //Initialize Values
  const app = firebase.app();
  const db = firebase.firestore();
  const tgsArticles = db.collection('tgs').doc('articles');

  //Get Articles Link
  tgsArticles.onSnapshot(doc => {
    const data = doc.data();
    var link = data.link;
    var staffLink = data.staffLink;
    var length = data.link.length;
    var trunc = length - 5;

    //Fill information
    document.getElementById('showBody').innerHTML = [`
      <table width='100%'>
        <tr>
          <td align='center' valign='top' colspan='3'>
            <h3><u>TGS Resources</u></h3>
            <div onclick='editMode()'>Click Here to Edit</div>
          </td>
        </tr>
        <tr>
          <td colspan='3' align='center'>
            <iframe src='` + link + `' id='articlesWin'></iframe>
          </td>
        </tr>
      </table>`]

    document.getElementById('editModal').innerHTML = [`
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

    var playerWidth = window.innerWidth-50;
    var playerHeight = window.innerHeight-110;
    $('#articlesWin').css('width', playerWidth +'px');
    $('#articlesWin').css('height', playerHeight +'px');
  })
}
//Update Viewer Facing TGS Articles
function updateTGSArticles() {
  const db = firebase.firestore();
  const tgsArticles = db.collection('tgs').doc('articles');

  var tgsArticleLink = "";
  if (document.getElementById('tgsArticleLink').value != ""){
    tgsArticleLink = document.getElementById('tgsArticleLink').value;
    tgsArticles.update({ link: tgsArticleLink });
  }
}
//Update Staff Facing TGS Articles
function updateStaffArticles(){
  const db = firebase.firestore();
  const tgsArticles = db.collection('tgs').doc('articles');

  var tgsArticleLink = '';
  if (document.getElementById('tgsArticleLink').value != ""){
    tgsArticleLink = document.getElementById('tgsArticleLink').value;
    tgsArticles.update({ staffLink: tgsArticleLink });
  }
}
//Clear dialog box for TGS Articles
function clearTGSArticles(){
  document.getElementById('tgsArticleLink').value = "";
}

function showTGSRUser(){
  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');
  var total;

  //Framework
  document.getElementById('showBody').innerHTML = [`<div align='center'><h3>Video Source</h3><a href='https://tubitv.com/series/539/beast-wars' target='_blank'>Click Here to watch</a></div>`]

  tgsrVideos.onSnapshot(doc => {
    const data = doc.data();

    document.getElementById('showBody').innerHTML = [`
      <table width='100%'>
        <tr>
          <td align='center' valign='top' colspan='3'>
            <h3><u>TGSR Resources</u></h3>
          </td>
        </tr>
        <tr>
          <td colspan='3' align='center'>
            <div align='center'>Videos -> <a href='` + data.source + `' target='_blank'>Click Here to watch</a></div>` +
            `<a href='./tgs.html' target='_blank'>Open in New Window</a>` +
            `<iframe src='` + data.notes + `' id='notesWin'></iframe>
          </td>
        </tr>
      </table>`]

    $('#notesWin').css('width', playerWidth +'px');
    $('#notesWin').css('height', (playerHeight-25) +'px');
  })

  document.getElementById('editModal').innerHTML = [`
    <div id='body'>Videos: <input type='text' id='v1'><br>
    Notes: <input type='text' id='v2'>
    <button onclick='changeVideos()'>Change Videos</button></div>`];

  $('#v1').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
  $('#v2').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
}
function showTGSR(){
  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');
  var total;

  //Framework
  document.getElementById('showBody').innerHTML = [`<div align='center'><h3>Video Source</h3><a href='https://tubitv.com/series/539/beast-wars' target='_blank'>Click Here to watch</a></div>`]

  tgsrVideos.onSnapshot(doc => {
    const data = doc.data();

    document.getElementById('showBody').innerHTML = [`
      <table width='100%'>
        <tr>
          <td align='center' valign='top' colspan='3'>
            <h3><u>TGSR Resources</u></h3>
            <div onclick='editMode()'>Click Here to Edit</div>
          </td>
        </tr>
        <tr>
          <td colspan='3' align='center'>
            <div align='center'>Videos -> <a href='` + data.source + `' target='_blank'>Click Here to watch</a></div>
            <iframe src='` + data.notes + `' id='notesWin'></iframe>
          </td>
        </tr>
      </table>`]

    $('#notesWin').css('width', playerWidth +'px');
    $('#notesWin').css('height', (playerHeight-45) +'px');
  })

  document.getElementById('editModal').innerHTML = [`
    <div id='body'>Videos: <input type='text' id='v1'><br>
    Notes: <input type='text' id='v2'>
    <button onclick='changeVideos()'>Change Videos</button></div>`];

  $('#v1').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
  $('#v2').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
}
//Change Videos
function changeVideos(){
  var video1 = document.getElementById('v1').value;
  var video2 = document.getElementById('v2').value;

  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');

  if (video1 != ""){
    tgsrVideos.update({ source: video1});
  }
  if (video2 != ""){
    tgsrVideos.update({ notes: video2});
  }
}
//Resize for TGSR
function resizeTGSR(){
  //Resize based on winSize (min 220*124)
  var playerWidth = (window.innerWidth-75)/3;
  var playerHeight = ((playerWidth*9)/16);
  if (playerWidth < '220'){
    for (i=1; i < 6; i++){
      $('#tgsrVid'+i).css('width', '220px');
      $('#tgsrVid'+i).css('height', '124px');
    }
    alert('Window is too small.\nPlease enlarge the window or try another browser and try again.');
  } else {
    for (i=1; i < 6; i++){
      $('#tgsrVid'+i).css('width', playerWidth +'px');
      $('#tgsrVid'+i).css('height', playerHeight +'px');
    }
  }
}

function showTVSVids(){
  //Framework
  document.getElementById('showBody').innerHTML = [`
    <h2 align='center'>This page will be reworked in a future update.</h2>`]
}
function showTVS(){
  //Framework
  document.getElementById('showBody').innerHTML = [`
    <h2 align='center'>This page will be reworked in a future update.</h2>`]
}

function editMode(){
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName('close')[0];

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
}
