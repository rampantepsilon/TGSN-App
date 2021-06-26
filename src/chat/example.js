let options = {
    options: {
        clientId: 'o118lfy65junb52nuye0weh4xbvn11',
        debug: true
    },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: "TGSNBot",
        password: "oauth:4ljmpd9jxzgcquvwojo0370uocddm3"
    },
    channels: [ "#thegamingsaloonnetwork" ]
};

let oauth = 'Bearer 4ljmpd9jxzgcquvwojo0370uocddm3';

let tgsnMods = ['thegamingsaloonnetwork', 'tgsnbot', 'rampantepsilon', 'peacemaker2448', 'tommygun2442'];

let client = new tmi.client(options);

// Connect the client to the server..
client.connect();
