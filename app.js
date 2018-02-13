const five = require('johnny-five');
const board = new five.Board();
const Player = require('player');
const DESPACITO = '../despacito_cut.mp3';
const makeRequest = require('./requestService.js');

// Initialize webserver
// const WebServer = require('./server.js');
// const server = new WebServer(3000);
// server.start();

// Initialize webcam
const NodeWebcam = require('node-webcam');

// Define JSON File
 var fs = require("fs");
 console.log("\n *STARTING* \n");
// Get content from file
 var blob = fs.readFileSync("./config.json");
// Define to JSON type
 const config = JSON.parse(blob);
 // console.log(webcamOpts);

const webcam = NodeWebcam.create(config.webcamOpts);

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
