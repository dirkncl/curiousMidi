window.onload=function(){var ifr=document.createElement("iframe");ifr.name="iframe";ifr.frameborder="0";ifr.setAttribute("frameBorder", "0");ifr.style=`position:fixed;bottom:0;left:0;max-width:40%;max-height:35px;display:;opacity:0.9`;document.body.appendChild(ifr);var base="";var a_arr=document.getElementsByTagName("a");var hrefMid=[];var hrefContent=[];var midis=[];for(var i=0;i<a_arr.length;i++){hrefContent[i]=a_arr[i].href;hrefMid[i] = hrefContent[i].split('.').pop();if(hrefMid[i]==="mid"||hrefMid[i]==="kar"||hrefMid[i]==="midi"||hrefMid[i]==="rmi") {midis[i]=hrefContent[i];a_arr[i].target="iframe";a_arr[i].href="index.html?"+base+midis[i]}else{a_arr[i].target="_blank";}};}
