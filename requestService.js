const fetch = require('node-fetch');

module.exports = function makeRequest(img) {

  // Define JSON File
  var fs = require("fs");
  console.log("\n *STARTING* \n");
  // Get content from file
  const blob = fs.readFileSync("./config.json");
  // Define to JSON type
  const config = JSON.parse(blob);

  const url = config.imagePushUrl;

  const data = {
    title: "Nyansatt",
    content: "Nok et medlem i gjengen!",
    image: img
  }

  // console.log(data);
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IkhSIn0.lK6CKFmDzmu66wUss9DHkuFYLIxkkNtPyDN8pnIpot4',
      'Content-Type': 'application/json'
    }
  }).then(function(res){
    console.log(res);
  })
}
