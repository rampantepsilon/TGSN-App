function loadCommands(){
  //Initialize Values
  const app = firebase.app();
  const db = firebase.firestore();
  const commands = db.collection('bot').doc('commands');

  commands.onSnapshot(doc => {
    const data = doc.data();
    var commandList = document.getElementById('commandList');

    var parent = commandList;
    while(parent.hasChildNodes()){
       parent.removeChild(parent.firstChild);
    }

    var list = [];
    for (var j = 0; j < data.list.length; j++){
      list[j] = data.list[j];
    }

    list.sort();

    for (var i = 0; i < data.list.length; i++){
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

function addCommand(){
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
    commands: {[command]: response}
  }, {
    merge: true,
  })
}

function remCommand(){
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
    console.log(data.list, command);
    for (var i = 0; i < data.list.length; i++){
      if (data.list[i] == command){
        commands.update({
          list: firebase.firestore.FieldValue.arrayRemove(command)
        });
      }
    }
  });
}
