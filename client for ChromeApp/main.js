chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {"id": "WebRTC",
    bounds: {
      width: 1024,
      height: 768
    },
    minWidth: 1024,
    minHeight: 768,
    //state: 'maximized',
    //frame: 'none',
    resizable: false
  });
});