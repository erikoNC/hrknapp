const request = require('request');

module.exports = class PushService {

  constructor(host) {
    this.host = host;
  }

  createPush(title, content, imageData) {
    return {
      title: title,
      content: content,
      image: imageData != null ? imageData.replace('data:image/png;base64,', '') : ""
    }
  }

  sendPush(pushData) {
    var options = {
      uri: this.host,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IkhSIn0.lK6CKFmDzmu66wUss9DHkuFYLIxkkNtPyDN8pnIpot4'
      },
      body: JSON.stringify(pushData)
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode == 201) {
        console.log('Send push success');
      }
      console.log('Send push failed');
    });
  }
}
