var IS_CHROME = !!window.webkitRTCPeerConnection, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription;

if(IS_CHROME)
{
	RTCPeerConnection = webkitRTCPeerConnection;
	RTCIceCandidate = window.RTCIceCandidate;
	RTCSessionDescription = window.RTCSessionDescription;
}
else
{
	RTCPeerConnection = mozRTCPeerConnection;
	RTCIceCandidate = mozRTCIceCandidate;
	RTCSessionDescription = mozRTCSessionDescription;
}

var offerOptions = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
	}
};

chrome.desktopCapture.chooseDesktopMedia(["screen"], function(streamId){
	function gotStream(stream)
	{
		var socket = new WebSocket("ws://192.168.200.160:3000");
		
        
        socket.onopen = function(){
            socket.send(JSON.stringify({
                    "event": "_login",
                    "data": "1"
                }));
        }
		
		//pc.createOffer(sendOfferFn, function(error){
		//	console.log('Failure callback: ' + error);
		//}, offerOptions);
        var _pc;
		socket.onmessage = function(event){
			var json = JSON.parse(event.data);
            if(json.event === "_button")
            {
                console.log("recv222")
                //if(json.data == 1)
                //{
                var pc = new webkitRTCPeerConnection(null);
                _pc = pc;
        
                pc.onicecandidate = function(event){
                    if(event.candidate !== null)
                    {
                        socket.send(JSON.stringify({
                            "event": "_ice_candidate",
                            "data": {
                                "candidate": event.candidate
                            }
                        }));
                    }
                };

                pc.onaddstream = function(event){
                    document.getElementById('remoteVideo').src = URL.createObjectURL(event.stream);
                };

                var sendOfferFn = function(desc){
                    pc.setLocalDescription(desc);
                    socket.send(JSON.stringify({
                        "event": "_offer",
                        "data": {
                            "sdp": desc
                        }
                    }));
                };

                //document.getElementById('localVideo').src = URL.createObjectURL(stream);

                pc.addStream(stream);
                
                    pc.createOffer(sendOfferFn, function(error){
                	console.log('Failure callback: ' + error);
                }, offerOptions);
                //}
                
            }
			if(json.event === "_ice_candidate")
			{
                if(json.target == 0)
                {
                    console.log(json.target)
                    _pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
                }
			}
			else
			{
                if(json.target == 0)
                {
                    console.log(json.target)
                    _pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp), function(){
                        //_pc.createAnswer(sendAnswerFn, function (error){
                        //	console.log('Failure callback: ' + error);
                        //});
                    }, function(e){
                        console.log(e);
                    });
                }
			}
		};
	}
	
	function getUserMediaError(e)
	{
		
	}
	
	navigator.webkitGetUserMedia({
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: streamId,
				minWidth: 1024,
				maxWidth: 1024,
				minHeight: 768,
				maxHeight: 768
			}
		}
	}, gotStream, getUserMediaError);
});
