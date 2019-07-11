function HtmlLog(n){var o=!1===n?"none":"block",e=document.createElement("pre");e.id="internLog",e.style="text-align:left;font-size:12px;z-index:1000";var t,l,i=document.createElement("div");function r(n){console["old"+n]=console[n],console[n]=function(...arguments){const o=function(n,arguments){return arguments.reduce((o,e)=>o+'<span class="log-'+typeof e+" log-"+n+'">'+("object"==typeof e&&(JSON||{}).stringify?JSON.stringify(e):e)+"</span>&nbsp;","")}(n,arguments),e=document.getElementById(LogId);if(autoScroll){const n=document.getElementById(LogIdContainer),t=n.scrollHeight-n.clientHeight<=n.scrollTop+1;e.innerHTML+=o+"<br>",t&&(n.scrollTop=n.scrollHeight-n.clientHeight)}else e.innerHTML+=o+"<br>";console["old"+n].apply(void 0,arguments)}}i.id="InternContainer",i.style=`position:fixed;bottom:0;left:0;overflow: auto;height: 40px;max-width:50%;display:${o};z-index:1000;background-color:silver;`,i.onclick=function(){"40px"===this.style.height?this.style.height="15px":this.style.height="40px"},i.appendChild(e),document.body.appendChild(i),LogId="internLog",LogIdContainer="InternContainer",autoScroll=!0,t="\n.log-warn { color: orange }\n.log-error { color: red }\n.log-info { color: skyblue }.log-log { color: black }\n.log-warn, .log-error { font-weight: bold; }\n::-webkit-scrollbar {width: 0px;height: 0px;}\n",(l=document.createElement("style")).textContent=t,document.head.appendChild(l),r("log"),r("debug"),r("warn"),r("error"),r("info")};var min = 1,max = 113241;var rand=Math.floor(Math.random()*(max-min+1))+min;window.onload = function(){HtmlLog();document.body.style.backgroundColor = "black";var tb = document.createElement("input");tb.id = "time_button";tb.type = "button";tb.title = "click to random\n----------\ncurrent file: ";tb.style = "position:absolute;height:2.2em;width:10em;left:50%;right:50%;display:none;color:blue;fontSize:34pt;background:gold";document.body.parentNode.insertBefore(tb, document.body);var time_button = document.getElementById("time_button");midiPlayTime = timePlay;function timePlay(e){time_button.style.display = "";var result;var m=parseInt(e.time/60)%60;if(m<10)m="0"+m;var s=parseInt(e.time%60);if(s<10)s="0"+s;time_button.value=m+":"+s;};function reload(){var meta=document.createElement("meta");meta.setAttribute("http-equiv","refresh");meta.setAttribute("content","0;URL="+document.URL+"");document.head.appendChild(meta)};time_button.onclick = function(){reload()};var toPlay = "https://bitmidi.com/uploads/"+rand+".mid";var fileName = toPlay.split('/').pop();document.title = fileName.replace('.'+fileName.split('.').pop(),"");tb.title += fileName.replace('.'+fileName.split('.').pop(),"")+"\n----------\n";tb.title +="Press Space to stop\n----------\nUp Arrow to increase volume\nDown Arrow to decrease volume\nctrl+c to toggle compressor";return midiPlay(toPlay);}
