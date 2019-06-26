var context, 
    audioBuffer,
    midiBuffer,
    midiArray,
    midiInitClose,
    IntrumentNumMising,
    cookies = {
    set: function(e, n, t) {
      var o = "";
      if(t) {
        var i = new Date;
        i.setTime(i.getTime() + 24 * t * 60 * 60 * 1e3), o = "; expires=" + i.toGMTString()
      }
      document.cookie = e + "=" + n + o + "; path=/"
    },
    get: function(e) {
      for(var n = e + "=", t = document.cookie.split(";"), o = 0; o < t.length; o++) {
        for(var i = t[o];
          " " == i.charAt(0);) i = i.substring(1, i.length);
        if(0 == i.indexOf(n)) return i.substring(n.length, i.length)
      }
    },
    del: function(e) {
      this.set(e, "", -1)
    }
  },
  SoundsOutput = function() {
    function n(e, n) {
      var t = "[Output] " + e;
      return arguments[0] = t, console.log.apply(console, arguments)
    }

    function t() {
      var e = Object.keys(s),
        n = e[e.length - 1];
      return s[n]
    }

    function o(e, n) {
      t().connect(n), s[e] = n
    }

    function i(e) {
      e.connect(c)
    }

    function e(e) {
      return void 0 === e || 1 < e || e < 0 ? console.log("Invalid volume!", e) : (cookies.set("volume", e), void(s.gain.gain.value = e))
    }
    var r, a, c, s = {};
    return {
      setup: function(e) {
        r = e;
        var n = cookies.get("volume");
        return a = n ? parseFloat(n) : .8, c = s.gain = r.createGain(), s.gain.gain.value = a, o("compressor", r.createDynamicsCompressor()), t().connect(r.destination), c.receive = i, c
      },
      set_vol: e,
      decrease_vol: function() {
        a <= .01 || e(a -= .05)
      },
      increase_vol: function() {
        1.01 <= a || e(a += .05)
      },
      current_vol: function() {
        return s.gain.gain.value
      },
      toggle_compressor: function() {
        if(s.compressor)
          n("Disabling DynamicsCompressor."),
          s.compressor.disconnect(),
          delete s.compressor,
          t().connect(r.destination);
        else {
          n("Enabling DynamicsCompressor.");
          var e = t();
          e.disconnect(),
          s.compressor = r.createDynamicsCompressor(),
          e.connect(s.compressor),
          s.compressor.connect(r.destination)
        }
      }
    }
  }(),
  curiousMidiJS = "lib/curiousMidi.js",
  paths = "../muki-io/",
  InputChannel = 1,
  OutputChannel = 2,
  source = 0,
  audioBufferSize = Math.pow(2, 13),
  midReadWave = 0,
  song = 0,
  midiStartTime = 0,
  audio_status = "";
context = new AudioContext;
var gain, 
    soundvol = SoundsOutput.setup(context),
  L = 2,
  gainValue = 1;
SoundsOutput.set_vol(.8);
var KeyState = !1;

var loadFileTextStore = [];
function loadFileText(file, cb){
  if(!(loadFileTextStore.includes(file))){
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('text/plain; charset=utf-8');
    rawFile.open("GET", file, true);
    rawFile.onload = function () {
      var ScriptBuff = rawFile.responseText;
      //if(rawFile.readyState === 4) {
      //  if(rawFile.status === 200 || rawFile.status == 0) {
         eval.apply( window, [ScriptBuff]);
         cb();
         
        //}
      //}
    }
    rawFile.send(null);
  }
}    


function SciptLoad(e, n) {
  var t = document.getElementsByTagName("script")[0],
      o = document.createElement("script");
  o.onload = function() {
    n()
  },
  o.onerror = function() {
    ConsoleLog("Where your script " + e)
  },
  o.src = e,
  o.type = "text/javascript",
  t.parentNode.insertBefore(o, t)
}

document.addEventListener("keydown", function(e) {
  if(27 == e.keyCode || !(KeyState || e.metaKey)) {
    switch(e.ctrlKey){
      case false:
        switch (e.keyCode) {
          case 9:
            e.preventDefault(), midiStop();
            shuffle();
            break;
          case 32:
            e.preventDefault(), midiStop();
            break;
          case 38://upArrow
            e.preventDefault();
            SoundsOutput.increase_vol();
            console.log(SoundsOutput.current_vol());
            break;
          case 40://downArrow
            e.preventDefault();
            SoundsOutput.decrease_vol();
            console.log(SoundsOutput.current_vol());
            break;
          case 37://leftArrow
            e.preventDefault();
            midiStop();
            prevSong();
            break;
          case 39://rightArrow
            e.preventDefault();
            midiStop();
            nextSong();
            break;
        };break;
      case true:
        switch (e.keyCode) {
          case 67://c
            e.preventDefault();
            SoundsOutput.toggle_compressor();
            break;
          case 83://s
            e.preventDefault();
            document.getElementById('togglesearch').click();
            break;
          case 76://l
            e.preventDefault();
            document.getElementById('togglesong').click();
            break;
          case 70://f
            e.preventDefault();
            document.querySelector("#myfiles").click();
            break;
          case 68://d
            e.preventDefault();
            document.querySelector("#myDir").click();
            break;
            
        };break;
    }
  }
});
var midiPlayEvent = {};

function nextWaveRead(e) {
  if(midiPlayEvent.time = context.currentTime - midiStartTime, midiPlayTime(midiPlayEvent), 0 != (midReadWave = cmInterface.midSongReadWave(song, audioBuffer, 2 * audioBufferSize)))
    for(var n = 0; n < audioBufferSize; n++)
      if(n < midReadWave)
        for(var t = 0; t < L; t++) e.outputBuffer.getChannelData(t)[n] = cmInterface.getValue(audioBuffer + 2 * n, cmInterface.i32) / cmInterface.i32Max;
      else {
        ConsoleLog("Filling 0 at end of buffer");
        for(t = 0; t < L; t++) e.outputBuffer.getChannelData(t)[n] = 0
      }
  else midiStop()
}

function loadMissingPatch(t, e, o) {
  var i = new XMLHttpRequest;
  i.open("GET", e + o, !0), i.responseType = "arraybuffer", i.onerror = function() {
    ConsoleLog("Error: patch file none or cannot retrive " + e + o)
  }, i.onload = function() {
    if(IntrumentNumMising--, cmInterface.createPat(o, cmInterface.buffToArr(i.response)), ConsoleLog("Loading instruments: " + IntrumentNumMising), 0 == IntrumentNumMising) {
      stream = cmInterface.midIstreamOpenMem(midiBuffer, midiArray.length);
      var e = cmInterface.midCreateOptions(context.sampleRate, cmInterface.MID_AUDIO_S16LSB, 2 * audioBufferSize);
      song = cmInterface.midSongLoad(stream, e), midiInitClose = cmInterface.midIstreamClose(stream), cmInterface.midSongStart(song), source = context.createScriptProcessor(audioBufferSize, InputChannel, OutputChannel), audioBuffer = cmInterface.midMemory(2 * audioBufferSize), source.onaudioprocess = nextWaveRead;
      var n = context.createGain();
      n.gain.value = gainValue, source.connect(n), n.connect(soundvol), midiStartTime = context.currentTime, ConsoleLog("Playing: " + t + " ...")
    }
  }, i.send()
}

function midiPlay(e) {
  // One-liner to resume playback when user interacted with the page.
//document.querySelector('button').addEventListener('click', function() {
  
//});
  context.resume().then(()=>{console.log('Playback resumed successfully');});    
  midiStop();
  /*
  for(var n = "", t = 0; t < document.scripts.length; t++) {
    document.scripts[t].src;
    n = curiousMidiJS
  }
  for(t = 0; t < document.scripts.length; t++) {
    if(n == document.scripts[t].src) return
  }*/
  //loadFileTextStore=[];
  var cMjs = curiousMidiJS;
  ConsoleLog("Loading curiousMidi ... "),
  /*SciptLoad(n, function() {
    
    midiFileLoader(e)
  })*/
  loadFileText(cMjs, function() {
    
    midiFileLoader(e)
  })
}

function midiFileLoader(i) {
  ConsoleLog("Loading MIDI file " + i + " ...");
  var r = new XMLHttpRequest;
  r.open("GET", i, !0),
  r.responseType = "arraybuffer",
  r.onerror = function() {
    ConsoleLog("Error: Cannot retrieve MIDI file " + i)
  },
  r.onload = function() {
    ConsoleLog("MIDI file loaded: " + i),
    midiArray = cmInterface.buffToArr(r.response),
    midiBuffer = cmInterface.midMemory(midiArray.length),
    cmInterface.midToMemory(midiArray, midiBuffer),
    midiInitClose = cmInterface.midInit(),
    stream = cmInterface.midIstreamOpenMem(midiBuffer, midiArray.length);
    var e = cmInterface.midCreateOptions(context.sampleRate, cmInterface.MID_AUDIO_S16LSB, 2 * audioBufferSize);
    if(song = cmInterface.midSongLoad(stream, e), midiInitClose = cmInterface.midIstreamClose(stream), 0 < (IntrumentNumMising = cmInterface.midSongGetNumMissingInstruments(song)))
      for(var n = 0; n < IntrumentNumMising; n++) {
        var t = cmInterface.midSongGetMissingInstrument(song, n);
        loadMissingPatch(i, paths + "pat/", t)
      }
      else {
        cmInterface.midSongStart(song),
        source = context.createScriptProcessor(audioBufferSize, InputChannel, OutputChannel), audioBuffer = cmInterface.midMemory(2 * audioBufferSize),
        source.onaudioprocess = nextWaveRead;
        var o = context.createGain();
        o.gain.value = gainValue,
        source.connect(o),
        o.connect(soundvol),
        midiStartTime = context.currentTime,
        ConsoleLog("Playing: " + i + " ...")
      }
  },
  r.send()
}

function midiStop() {
  source && (source.disconnect(), source.onaudioprocess = 0, source = 0, cmInterface.midFreeMemory(audioBuffer), cmInterface.midFreeMemory(midiBuffer), cmInterface.midSongFree(song), song = 0, cmInterface.midExit(), source = 0), midiPlayEvent.time = 0, midiPlayTime(midiPlayEvent)
}
var ConsoleLog = function(e) {
    console.log(e);
  },
  midiPlayTime = function(e) {},
  get_audio_status = function() {
    return audio_status
  };
var includeStore = [];
function include(e) {
  /*
  var n = document.getElementsByTagName("script")[0],
      t = document.createElement("script");
  t.onerror = function() {
    ConsoleLog("Where your script " + e)
  },
  t.src = e,
  t.type = "text/javascript",
  n.parentNode.insertBefore(t, n)
  */

//function loadFileText(e){
  if(!(includeStore.includes(e))){
    var scr = new XMLHttpRequest();
    scr.overrideMimeType('text/plain; charset=utf-8');
    scr.open("GET", e, true);
    scr.onload = function () {
      if(scr.readyState === 4) {
        if(scr.status === 200 || scr.status == 0) {
         eval.apply( window, [scr.responseText]);
        }
      }
    }
    scr.send(null);
  }
//}  
}
include("js/interface.js");
var ls = location.search,
  par = "";
  - 1 != (par = decodeURIComponent(ls).replace(/\+/g, " ").replace("?", "")).indexOf("&") && ((par = par.split("&"))[1] = "", par = par[0]), "" != par && midiPlay(par);

  
  
