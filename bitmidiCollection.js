var min = 1,max = 113241;var rand=Math.floor(Math.random()*(max-min+1))+min;window.onload = function(){document.body.style.backgroundColor = "black";var tb = document.createElement("input");tb.id = "time_button";tb.type = "button";tb.title = "click to random\n----------\ncurrent file: ";tb.style = "position:absolute;left:50%;right:50%;display:none;color:red";document.body.appendChild(tb);var time_button = document.getElementById("time_button");midiPlayTime = timePlay;function timePlay(e){time_button.style.display = "";var result;var m=parseInt(e.time/60)%60;if(m<10)m="0"+m;var s=parseInt(e.time%60);if(s<10)s="0"+s;time_button.value=m+":"+s;};function reload(){var meta=document.createElement("meta");meta.setAttribute("http-equiv","refresh");meta.setAttribute("content","0;URL="+document.URL+"");document.head.appendChild(meta)};time_button.onclick = function(){reload()};var toPlay = "https://bitmidi.com/uploads/"+rand+".mid";var fileName = toPlay.split('/').pop();document.title = fileName.replace('.'+fileName.split('.').pop(),"");tb.title += fileName.replace('.'+fileName.split('.').pop(),"")+"\n----------\n";tb.title +="Press Space to stop\n----------\nUp Arrow to increase volume\nDown Arrow to decrease volume\nctrl+c to toggle compressor";return midiPlay(toPlay);}
