/*Dirk.L.Nicolaas*/function logHtml(t){var e=(t=t||!0)?"block":"none",o=document.createElement("span");o.id="sp",o.style="font-size:12px;z-index:1000";var n,i,l=document.createElement("div");l.id="log",l.style=`position:fixed;bottom:0;left:0;overflow: auto;height: 35px;display:${e};z-index:10;background-color:rgba(192, 192, 192, 0.8);  `,l.onclick=function(){"35px"===this.style.height?(this.style.height="15px",this.style.width="25px",this.style.backgroundColor="red",this.title="click to expand Logger",o.style.opacity="0"):(this.style.height="35px",this.style.width="auto",this.style.backgroundColor="rgba(192, 192, 192, 0.8)",o.style.opacity="1")},l.appendChild(o),document.body.appendChild(l),n="#log::-webkit-scrollbar {width: 5px;height: 0px;}#log::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);border-radius: 10px;}#log::-webkit-scrollbar-thumb {border-radius: 3px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);}",(i=document.createElement("style")).textContent=n,document.head.appendChild(i),console||(console={});var r=console.log;console.log=function(t){l.style.display=e;var n=l.scrollHeight-l.clientHeight<l.scrollTop+1;o.innerHTML+="object"==typeof t?(JSON&&JSON.stringify?JSON.stringify(t):String(t))+"<br/>":t+"<br />",n&&(l.scrollTop=l.scrollHeight-l.clientHeight)},r()}//window.onload=function(){return logHtml()};