/***
 * cookie.js
 * A simple cookie library supporting hash trees
 * Requires Joe Tools for merge_objects() and serialize().
 * 
 * var tree = new CookieTree();
 * tree.set( "foo", "bar" );
 * tree.set( "complex", { hello: "there", array: [1,2,3] } );
 * tree.save();
 * 
 * Copyright (c) 2007 Joseph Huckaby.
 * Released under the LGPL v3.0: http://www.opensource.org/licenses/lgpl-3.0.html
 */

/* if (!window.merge_objects || !window.serialize)
	alert("ERROR: cookie.js requires tools.js."); */
class CookieTree {
  constructor(args) {
  	// class constructor
  	if (args) {
  		for (var key in args) this[key] = args[key];
  	}
  	
  	if (!this.expires) {
  		var now = new Date();
  		now.setFullYear( now.getFullYear() + 10 ); // 10 years from now
  		this.expires = now.toGMTString();
  	}
  	
  	this.parse();
  }
  
  domain (){ return location.hostname}
  path (){ return location.pathname}
  
  parse () {
  	// parse document.cookie into hash tree
  	this.tree = {};
  	var cookies = document.cookie.split(/\;\s*/);
  	for (var idx = 0, len = cookies.length; idx < len; idx++) {
  		var cookie_raw = cookies[idx];
  		if (cookie_raw.match(/^CookieTree=(.+)$/)) {
  			var cookie = null;
  			var cookie_raw = unescape( RegExp.$1 );
  			// Debug.trace("Cookie", "Parsing cookie: " + cookie_raw);
  			try {
  				eval( "cookie = " + cookie_raw + ";" );
  			}
  			catch (e) {
  				// Debug.trace("Cookie", "Failed to parse cookie.");
  				cookie = {}; 
  			}
  			
  			this.tree = merge_objects( this.tree, cookie );
  			idx = len;
  		}
  	}
  }
  
  get (key) {
  	// get tree branch given value (top level)
  	return this.tree[key];
  };
  
  set (key, value) {
  	// set tree branch to given value (top level)
  	this.tree[key] = value;
  }
  
  save () {
  	// serialize tree and save back into document.cookie
  	var cookie_raw = 'CookieTree=' + escape(serialize(this.tree));
  	
  	if (!this.path.match(/\/$/)) {
  		this.path = this.path.replace(/\/[^\/]+$/, "") + '/';
  	}
  	
  	cookie_raw += '; expires=' + this.expires;
  	cookie_raw += '; domain=' + this.domain;
  	cookie_raw += '; path=' + this.path;
  	
  	// Debug.trace("Cookie", "Saving cookie: " + cookie_raw);
  	
  	document.cookie = cookie_raw;
  }
  
  remove () {
  	// remove cookie from document
  	var cookie_raw = 'CookieTree={}';
  	
  	if (!this.path.match(/\/$/)) {
  		this.path = this.path.replace(/\/[^\/]+$/, "") + '/';
  	}
  	
  	var now = new Date();
  	now.setFullYear( now.getFullYear() - 1 ); // last year
  	cookie_raw += '; expires=' + now.toGMTString();
  	
  	cookie_raw += '; domain=' + this.domain;
  	cookie_raw += '; path=' + this.path;
  	
  	document.cookie = cookie_raw;
  }
}
  function imports(url){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if(xhr.readyState === 4) {
        if(xhr.status === 200 || xhr.status == 0) {
         eval.apply( window, [xhr.responseText] )
        }
      }
    }
    xhr.send(null);
  };  
  window.onload = function (){
	  imports("lib/palette.js");
	  imports("lib/bitmap.js");
    imports("lib/tween.js");
  }
 
