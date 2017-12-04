var five = require('johnny-five');
var board = new five.Board();
var Player = require('player');
const DESPACITO = '../despacito_cut.mp3';
var fetch = require('node-fetch');


var NodeWebcam = require('node-webcam');

var webcamOpts = {

    //Picture related
    width: 20,
    height: 20,
    quality: 5,

    //Delay to take shot
    delay: 0,

    //Save shots in memory
    saveShots: true,

    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: 'png',

    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,


    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: 'base64',

    //Logging
    verbose: false

};

var webcam = NodeWebcam.create(webcamOpts);

board.on('ready', function() {
  var despacitoButton = new five.Button(2);
  var led = new five.Led(13);
  var player = new Player(DESPACITO);

  player.on('error', function(err){
    console.log(err);
  });

  var isPlaying = false;
  despacitoButton.on('press', function() {
    !isPlaying ? player.play() : player.stop()
    isPlaying = !isPlaying;
    webcam.capture('test', function(err, data) {
        makeRequest(data);
      });
    })
  })

function makeRequest(img) {
  const url = 'http://10.22.200.61:8080/push';

  var data = {
    title: "NYANSATT!!!",
    content: "NYANSATT!!!",
    image: img
  }

  console.log(data);
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IkpvYXJrIn0.0_NFtDwF3WdDkizkRMiZNl947GAesQ1vXsL9qbYrLdg',
      'Content-Type': 'application/json'
    }
  }).then(function(res){
    console.log(res);
  })
}
