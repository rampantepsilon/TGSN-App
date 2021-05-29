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
            <h3><u>TGS Resources</u></h3>
          </td>
        </tr>
        <tr>
          <td colspan='3' align='center'>
            <iframe src='` + staffLink + `' id='articlesWin'></iframe>
          </td>
        </tr>
      </table>`]

    document.getElementById('editModal').innerHTML = [`
      <tr>
        <td align='center' width='35%'>
          <div id='body'>Current TGS Articles (Viewer Facing):<h5>(Only the document part of the URL is shown here)</h5><font size='2'><a href='` + link + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + link.substring(35, trunc) + `</a></font></div>
        </td>
        <td align='center' width='35%'>
          <div id='body'>Current TGS Articles (Staff Facing):<h5>(Only the document part of the URL is shown here)</h5><font size='2'><a href='` + staffLink + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + staffLink.substring(35, trunc) + `</a></font></div>
        </td>
        <td align='center' id='body'>
          Enter the new link for TGS Articles<br>
          <input id='tgsArticleLink'><br>
          <button onclick='updateTGSArticles()'>Update Viewer Articles</button>
          <button onclick='updateStaffArticles()'>Update Staff Articles</button><br>
          <button onclick='clearTGSArticles()'>Clear Link Field</button>
        </td>
      </tr>`]

    var playerWidth = window.innerWidth-50;
    var playerHeight = window.innerHeight-140;
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
            <iframe src='` + staffLink + `' id='articlesWin'></iframe>
          </td>
        </tr>
      </table>`]

    document.getElementById('editModal').innerHTML = [`
      <tr>
        <td align='center' width='35%'>
          <div id='body'>Current TGS Articles (Viewer Facing):<h5>(Only the document part of the URL is shown here)</h5><font size='2'><a href='` + link + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + link.substring(35, trunc) + `</a></font></div>
        </td>
        <td align='center' width='35%'>
          <div id='body'>Current TGS Articles (Staff Facing):<h5>(Only the document part of the URL is shown here)</h5><font size='2'><a href='` + staffLink + `' target='_blank'>`/*Click Here (Opens in new tab)*/ + staffLink.substring(35, trunc) + `</a></font></div>
        </td>
        <td align='center' id='body'>
          Enter the new link for TGS Articles<br>
          <input id='tgsArticleLink'><br>
          <button onclick='updateTGSArticles()'>Update Viewer Articles</button>
          <button onclick='updateStaffArticles()'>Update Staff Articles</button><br>
          <button onclick='clearTGSArticles()'>Clear Link Field</button>
        </td>
      </tr>`]

    var playerWidth = window.innerWidth-50;
    var playerHeight = window.innerHeight-140;
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

function showTGSR(){
  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');
  var total;

  //Framework
  document.getElementById('showBody').innerHTML = [`
    <h2 align='center'>This page will be reworked in a future update.<br>
    Current TGSR Series is Transformers: Beast Wars on TubiTV.<br></h2>
    <div align='center'><a href='https://tubitv.com/series/539/beast-wars' target='_blank'>Click Here to watch</a></div>`]

  tgsrVideos.onSnapshot(doc => {
    const data = doc.data();
    if (data.v1 != 'n/a'){
      $('#video1').show();
      document.getElementById('video1').innerHTML = [`Video 1<br>
        <iframe is="x-frame-bypass" src='` + data.v1 + `' width='567px' height='318px' id='tgsrVid1' allowfullscreen style='overflow-y:hidden;'></iframe>`];
    }
    if (data.v1 == 'n/a'){
      $('#video1').hide();
    }
    if (data.v2 != 'n/a'){
      $('#video2').show();
      document.getElementById('video2').innerHTML = [`Video 2<br>
        <iframe is="x-frame-bypass" src='` + data.v2 + `' width='567px' height='318px' id='tgsrVid2' allowfullscreen style='overflow-y:hidden;'></iframe>`];
    }
    if (data.v2 == 'n/a'){
      $('#video2').hide();
    }
    if (data.v3 != 'n/a'){
      $('#video3').show();
      document.getElementById('video3').innerHTML = [`Video 3<br>
        <iframe is="x-frame-bypass" src='` + data.v3 + `' width='567px' height='318px' id='tgsrVid3' allowfullscreen style='overflow-y:hidden;'></iframe>`];
    }
    if (data.v3 == 'n/a'){
      $('#video3').hide();
    }
    if (data.v4 != 'n/a'){
      $('#video4').show();
      document.getElementById('video4').innerHTML = [`Video 4<br>
        <iframe is="x-frame-bypass" src='` + data.v4 + `' width='567px' height='318px' id='tgsrVid4' allowfullscreen style='overflow-y:hidden;'></iframe>`];
    }
    if (data.v4 == 'n/a'){
      $('#video4').hide();
    }
    if (data.v5 != 'n/a'){
      $('#video5').show();
      document.getElementById('video5').innerHTML = [`Video 5<br>
        <iframe is="x-frame-bypass" src='` + data.v5 + `' width='567px' height='318px' id='tgsrVid5' allowfullscreen style='overflow-y:hidden;'></iframe>`];
    }
    if (data.v5 == 'n/a'){
      $('#video5').hide();
    }
  })

  document.getElementById('editModal').innerHTML = [`
    <div id='body'>Video 1: <input type='text' id='v1'><br>
    Video 2: <input type='text' id='v2'><br>
    Video 3: <input type='text' id='v3'><br>
    Video 4: <input type='text' id='v4'><br>
    Video 5: <input type='text' id='v5'><br>
    <button onclick='changeVideos()'>Change Videos</button><br>
    Tip: Use "n/a" to signify no video.</div>`];

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
  $('#v3').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
  $('#v4').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
  $('#v5').keyup(function(event){
    if (event.keyCode === 13){
      changeVideos();
    }
  })
}
//Change Videos
function changeVideos(){
  var video1 = document.getElementById('v1').value;
  var video2 = document.getElementById('v2').value;
  var video3 = document.getElementById('v3').value;
  var video4 = document.getElementById('v4').value;
  var video5 = document.getElementById('v5').value;

  const db = firebase.firestore();
  const tgsrVideos = db.collection('tgsr').doc('videos');

  if (video1 != ""){
    tgsrVideos.update({ v1: video1});
  }
  if (video2 != ""){
    tgsrVideos.update({ v2: video2});
  }
  if (video3 != ""){
    tgsrVideos.update({ v3: video3});
  }
  if (video4 != ""){
    tgsrVideos.update({ v4: video4});
  }
  if (video5 != ""){
    tgsrVideos.update({ v5: video5});
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

function editMode(){
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName('close')[0];

  modal.style.display = 'block';
  span.onclick = function(){
    modal.style.display = 'none';
  }
}
