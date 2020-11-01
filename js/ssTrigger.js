function ss(screensaverTime, ssHTML){    
  ScreenSaver(screensaverTime||'5', function() {
    var mask = document.createElement("div");
    mask.style="position:fixed;top:0;left:0;z-index:1000;width:"+window.innerWidth+"px;"+window.innerHeight+"px;";
    for(var i = 0;i<80;i++){
      mask.innerHTML+="<br>"
    }  

     var msg = document.createElement("div");
     var isMobile=/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
     msg.style = "position:fixed;top:20px;left:40%;right:40%;color:ivory;z-index:1000"
     msg.innerHTML = "<center>Screen Saver  Active<br>Press anykey or<br>move mouse or touch here<br></center>";
     if(isMobile){
        msg.innerHTML = "<center>Touch your screen</center>";
     }     
     var ifr = document.createElement("iframe");
     ifr.src = ssHTML;
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
     div.style = "background-color:#000000;overflow-x: hidden;overflow-y: hidden;z-index:1";
     div.appendChild(ifr);
     div.appendChild(msg);
     div.appendChild(mask);
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
var ssHTML;
window.onload = function(){
  return ss(ssTimer, ssHTML)
}

