const http = require('http');
const fs = require('fs');
const index = fs.readFileSync( 'public/index.html');
const port = 3000;

const SerialPort = require('serialport');
const parser = new SerialPort.ReadlineParser({ delimiter: '\r\n' });
const serialport = new SerialPort.SerialPort({
    path: '/dev/ttyACM0', 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

serialport.pipe(parser);

const app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

const io = require('socket.io')(app);

io.on('connection', function(socket) {
    
    socket.on('allumer', function (data) {

        console.log( data );
        const send = serialport.write( data.status.toString() );
        // socket.emit('responseServer', JSON.stringify({
        //     button: data.status,
        //     status: send
        // }));
    });

    // socket.on('powerToggle',function (data) {

    //     if (data === false) {
            
    //         serialport.write("123");
    //     }
    // });
});

app.listen(port);
