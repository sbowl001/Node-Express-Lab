const { server } = require('./server.js');

server.get('/', function(req,res) {
    console.log('page requested');
    res.send('<h1> Hello World </h1>');
});

server.listen(3000);

