var express = require('express'),
app = express(),
server = require('http').createServer(app);

server.listen(3000);

app.get('/', function(req, res) {
	//res.sendFile(__dirname + '/aver-logo-100x100.png');
	res.sendFile(__dirname + '/webrtc.html');
});

var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({server: server});

var wscServer;
var wsc = [],
index = 0;

wss.on('connection', function(ws){
	console.log('connection');

	if(index == 0)
	{
		wscServer = ws;
		ws.on('message', function(message){
			var json = JSON.parse(message);

			if (json.target == 0)
			{
				wsc[0].send(message, function (error){
					if(error)
					{
						console.log('Send message error (' + desc + '): ', error);
					}
				});
			}
			else
			{
				wsc[1].send(message, function (error){
					if(error)
					{
						console.log('Send message error (' + desc + '): ', error);
					}
				});
			}
		});

	}
	else
	{
		wsc.push(ws);
		ws.on('message', function(message){
			var json = JSON.parse(message);

			wscServer.send(message, function (error){
				if(error)
				{
					console.log('Send message error (' + desc + '): ', error);
				}
			});
		});
	}
	index++;
	return;
	
	var otherIndex = index--,
	desc = null;

	if(otherIndex == 1)
	{
		desc = 'first socket';
	}
	else
	{
		desc = 'second socket';
	}

	ws.on('message', function(message){
		var json = JSON.parse(message);

		wsc[otherIndex].send(message, function (error){
			if(error)
			{
				console.log('Send message error (' + desc + '): ', error);
			}
		});
	});
	
	if(otherIndex == 0)
	{
		wsc[1] = ws;
	}
	index = 0;
});