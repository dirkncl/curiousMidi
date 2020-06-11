function ss(screensaverTime){    
  ScreenSaver(screensaverTime||'30', function() {
     var msg = document.createElement("div");
     msg.style = "position:fixed;top:20px;left:40%;right:40%;color:ivory;z-index:1000"
     msg.innerHTML = "<center>Screen Saver  Active<br>Press anykey or<br>mousemove or<br>mousedown or<br>touchmove<br>back To Page</center>"
     
     var ifr = document.createElement("iframe");
     //ifr.src = "screensaver/index.html";
     ifr.src = "../MakeItDark/index.html?zoomFull=true&ssTime=30";
     ifr.width = window.innerWidth;
     ifr.height = window.innerHeight;
     ifr.marginwidth = "0";
     ifr.marginheight = "0";
     ifr.align = "top";
     ifr.style = "z-index:-1000";
     ifr.scrolling = "No";
     ifr.frameborder = "0";
     ifr.hspace = "0";
     ifr.vspace = "0";
     
     var div = document.createElement("div");
     div.id="ssav";
     div.style = "background-color:#000000;overflow-x: hidden;overflow-y: hidden;z-index:10";
     div.appendChild(ifr);
     div.appendChild(msg);
     document.body.insertBefore(div, document.body.firstChild);
  }, function() {
      document.getElementById("ssav").remove()
  });
  
  
  function ScreenSaver(TimeInSecond, callback, backToPage) {
      var ev = "mousemove mousedown keypress touchmove";
      var evn = ev.split(" ");
      var timeout = 0;
      startTimer();
  
      function startTimer() {
          timeout = setTimeout(onExpires, Number(TimeInSecond)*1000);
          for(var i=0;i<evn.length;i++){
            document.addEventListener(evn[i], onActivity);
          }
      }
      
      function onExpires() {
          timeout = 0;
          callback();
      }
  
      function onActivity() {
          if (timeout) clearTimeout(timeout);
          else backToPage();
          for(var i=0;i<evn.length;i++){
            document.removeEventListener(evn[i], onActivity);
          }
          setTimeout(startTimer, 1000);
          
      }
  }
}
var ssTimer;

window.onload = function(){
  return ss(ssTimer)
}

