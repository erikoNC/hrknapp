const fetch = require('node-fetch');

module.exports = function makeRequest(img) {
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
