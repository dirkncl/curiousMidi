//window.onload = function(){return logHtml()};
function logHtml(display) {
  function insertStyle(sty){
    var style = document.createElement("style");
    style.textContent = sty;
    document.head.appendChild(style);
  };

  var logstyle = `
    #log::-webkit-scrollbar {width: 5px;height: 0px;}
    #log::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;}
    #log::-webkit-scrollbar-thumb {border-radius: 3px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);}
  `;
  display = display||true;
  var disp = display?"block":"none";
  
  var span = document.createElement("span");
  span.id = "sp";
  span.style = "font-size:12px;z-index:1000";
  
  var logger = document.createElement("div");
  logger.id = "log";
  logger.style = `
    position:fixed;
    bottom:0;
    left:0;
    /*overflow: hidden;*/
    overflow: auto;
    height: 35px;
    display:${disp};
    z-index:10;
    background-color:rgba(192, 192, 192, 0.8);
  `;
    logger.onclick=function(){
      if(this.style.height === "35px"){
        this.style.height = "15px";
        this.style.width = "25px";
        this.style.backgroundColor = "red";
        this.title = "click to expand Logger";
        span.style.opacity = "0";
        
        
      }
      else{
        this.style.height = "35px";
        this.style.width = "auto";
        this.style.backgroundColor ="rgba(192, 192, 192, 0.8)";
        span.style.opacity = "1";
      }
    }
  logger.appendChild(span);
  document.body.appendChild(logger);
  insertStyle(logstyle);
  
  if (!console) {console = {};}
  var consoleLogOld = console.log;
  
  
  console.log = function (message) {
      logger.style.display=disp;
      var ToBottom = logger.scrollHeight - logger.clientHeight < logger.scrollTop + 1;
      if (typeof message == 'object') {
          
          span.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br/>';
          
          //}            
      } else {
          span.innerHTML += message + '<br />';
          
      }
      if (ToBottom) {
        logger.scrollTop = logger.scrollHeight - logger.clientHeight;
      }
  
  }
  consoleLogOld();
}
