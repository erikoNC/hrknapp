var five = require('johnny-five');
var board = new five.Board();
var Player = require('player');
const DESPACITO = './despacito_cut.mp3';


var NodeWebcam = require('node-webcam');

var webcamOpts = {

    //Picture related
    width: 1280,
    height: 720,
    quality: 100,

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
    callbackReturn: "base64",

    //Logging
    verbose: false

};

var webcam = NodeWebcam.create(webcamOpts);

board.on('ready', function() {
  var despacitoButton = new five.Button(2);
  var led = new five.Led(13);
  var player = new Player(DESPACITO);
  // player.add('./despacito.mp3');

  player.on('error', function(err){
    // when error occurs
    console.log(err);
  });

  var isPlaying = false;
  despacitoButton.on('press', function() {
      !isPlaying ? player.play() : player.stop()
      isPlaying = !isPlaying;
      webcam.capture('test', function(err, data) {
          console.log(data)
      });
  })
})
