const request = require('request');

module.exports = class PushService {

  constructor(host) {
    this.host = host;
  }

  createPush(title, content, imageData) {
    return {
      title: title,
      content: content,
      image: imageData != null ? imageData.replace('data:image/jpeg;base64,', '') : ""
    }
  }

  sendPush(pushData) {
    var options = {
      uri: this.host,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6InZpZGFyYiJ9.aJl-TdahjQ4b9W9hq84X4ouDRcqhPRGKZrqonICSe-1'
      },
      body: JSON.stringify(pushData)
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode == 201) {
        console.log('Send push success');
      } else {
        console.log('Push failed with status code: ' + response.statusCode);
      }
    });
  }
}
