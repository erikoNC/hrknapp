var app = require('express')();

module.exports = class Webserver {

    constructor(port) {
        this.port = port;
    }

    start() {
        app.get('/', (req, res) => {
            res.send('HR Knappen er live');
        });
          
        var server = app.listen(this.port, () => {
            var host = server.address().address
            var port = server.address().port
            
            console.log("Example app listening at http://%s:%s", host, port)
        });
    }
}