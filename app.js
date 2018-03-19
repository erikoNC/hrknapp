var SerialPort = require('serialport');
var serialport = new SerialPort('/dev/tty.wchusbserial14620');
const DESPACITO = './despacito_cut.mp3';
const makeRequest = require('./requestService.js');
var player = require('play-sound')(opts = {})

// Initialize webcam
const NodeWebcam = require('node-webcam');

// Define JSON File
 var fs = require("fs");
 console.log("\n *STARTING* \n");
// Get content from file

 var blob = fs.readFileSync("./config.json");
// Define to JSON type
const config = JSON.parse(blob);

const webcam = NodeWebcam.create(config.webcamOpts);

serialport.on('open', () => {
  console.log('Serial port opened');

  serialport.on('data', data => {
    if (data[0] == 1) {
      console.log('Playing despacito');
      playDespacito();
    } 
    console.log(data[0]);
  });
});

function playDespacito() {
  player.play(DESPACITO, function(err) {});

  webcam.capture('test', (err, data) => {
    makeRequest(data.replace('data:image/png;base64,', ''));
  });
}
