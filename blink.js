const five = require('johnny-five');
const board = new five.Board();
const Player = require('player');
const DESPACITO = '../despacito_cut.mp3';
const fetch = require('node-fetch');


const NodeWebcam = require('node-webcam');

const webcamOpts = {

    //Picture related
    width: 500,
    height: 500,
    quality: 100,

    //Delay to take shot
    delay: 0,

    //Save shots in memory
    saveShots: false,

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

const webcam = NodeWebcam.create(webcamOpts);

board.on('ready', function() {
  const despacitoButton = new five.Button(2);
  const led = new five.Led(13);
  const player = new Player(DESPACITO);

  player.on('error', function(err){
    console.log(err);
  });

  var isPlaying = false;
  despacitoButton.on('press', function() {
    !isPlaying ? player.play() : player.stop()
    isPlaying = !isPlaying;
    webcam.capture('test', function(err, data) {
      makeRequest(data.replace('data:image/png;base64,', ''));
      });
    })
  })

function makeRequest(img) {
  const url = 'http://10.22.200.65:8080/push';

  const data = {
    title: "foo",
    content: "bar",
    image: img
  }

  // console.log(data);
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
