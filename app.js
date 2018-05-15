// Read config
var fs = require("fs");
var blob = fs.readFileSync("./config.json");
var config = JSON.parse(blob);

// Imports
var SerialPort = require('serialport');
var serialport = new SerialPort(config.serial_port);
var PushService = require('./pushService.js');
var pushService = new PushService(config.host);
var NodeWebcam = require('node-webcam');

// Constants
const BUTTON_PRESSED = 1;

// Initialize player
var player = require('play-sound')(opts = {});

// Initialize webcam
const webcam = NodeWebcam.create(config.webcam_opts);

serialport.on('open', () => {
  console.log('Serial port opened');

  serialport.on('data', data => {
    if (data[0] == BUTTON_PRESSED) {
      captureImageAndSendPush();
    } 
  });
});

function captureImageAndSendPush() {
  console.log('Capturing image and sending push');
  player.play(config.song, function(err) {});

  webcam.capture('image_employee', (err, data) => {
    let pushMessage = pushService.createPush('Nyansatt', 'Nyansatt, velkommen skal du være!', data);
    pushService.sendPush(pushMessage);
  });
}
