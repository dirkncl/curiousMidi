// 8-bit Palette Classes for use in HTML5 Canvas
// Ported from a C++ library written by Joseph Huckaby
// BlendShift Technology conceived, designed and coded by Joseph Huckaby
// Copyright (c) 2001-2002, 2010 Joseph Huckaby.
// Released under the LGPL v3.0: http://www.opensource.org/licenses/lgpl-3.0.html
class Color{
  constructor(r, g, b) {
    this.red = 0;
    this.green = 0;
    this.red = 0;
    this.set(r,g,b)
  }

  set (r, g, b) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }
}
class Cycle{  
  constructor(r, rev, l, h) {
    this.rate = r;
    this.reverse = rev;
    this.low = l;
    this.high = h;
  }
}

class Palette {
  constructor(clrs, cycls) {
    // represents a single palette, which can have
    // multiple "cycles" (animated color ranges) defined.
    
    this.colors = null;
    this.baseColors = null;
    this.cycles = null;
    this.numColors = 0;
    this.numCycles = 0;
  
    // class constructor
    this.colors = [];
    this.baseColors = [];
    for (var idx = 0, len = clrs.length; idx < len; idx++) {
      var clr = clrs[idx];
      this.baseColors.push( new Color( clr[0], clr[1], clr[2] ) );
    }
    
    this.cycles = [];
    for (var idx = 0, len = cycls.length; idx < len; idx++) {
      var cyc = cycls[idx];
      this.cycles.push( new Cycle( cyc.rate, cyc.reverse, cyc.low, cyc.high ) );
    }
    
    this.numColors = this.baseColors.length;
    this.numCycles = this.cycles.length;
  }  
  
  
  PRECISION = 100;
  USE_BLEND_SHIFT = 1;
  CYCLE_SPEED = 280;
  ENABLE_CYCLING = 1;
      
  // this utility function allows for variable precision floating point modulus
  DFLOAT_MOD (a,b) {
    return (Math.floor(a*this.PRECISION) % Math.floor(b*this.PRECISION))/this.PRECISION;
  }
    
  
    
  copyColors (source, dest) {
    // copy one array of colors to another
    for (var idx = 0, len = source.length; idx < len; idx++) {
      if (!dest[idx]) dest[idx] = new Color();
      dest[idx].red = source[idx].red;
      dest[idx].green = source[idx].green;
      dest[idx].blue = source[idx].blue;
    }
  }
    
  swapColors = function(a, b) {
    // swap the color values of a with b
    let temp;
    temp = a.red; a.red = b.red; b.red = temp;
    temp = a.green; a.green = b.green; b.green = temp;
    temp = a.blue; a.blue = b.blue; b.blue = temp;
  }
    
  reverseColors (colors, range) {
    // reverse order of colors
    var i;
    var cycleSize = (range.high - range.low) + 1;
  
    for (i=0; i<cycleSize/2; i++)
      this.swapColors(colors[range.low+i], colors[range.high-i]);
  }
    
  fadeColor (sourceColor, destColor, frame, max) {
    // fade one color into another by a partial amount, return new color in between
    var tempColor = new Color();
  
    if (!max) return sourceColor; // avoid divide by zero
    if (frame < 0) frame = 0;
    if (frame > max) frame = max;
  
    tempColor.red = Math.floor( sourceColor.red + (((destColor.red - sourceColor.red) * frame) / max) );
    tempColor.green = Math.floor( sourceColor.green + (((destColor.green - sourceColor.green) * frame) / max) );
    tempColor.blue = Math.floor( sourceColor.blue + (((destColor.blue - sourceColor.blue) * frame) / max) );
  
    return(tempColor);
  }
    
  shiftColors (colors, range, amount) {
    // shift (hard cycle) colors by amount
    var i, j, temp;
    amount = Math.floor(amount);
  
    for (i = 0; i < amount; i++) {
      temp = colors[range.high];
      for (j=range.high-1; j>=range.low; j--)
        colors[j+1] = colors[j];
      colors[range.low] = temp;
    } // i loop
  };
    
  blendShiftColors (colors, range, amount) {
    // shift colors using BlendShift (fade colors creating a smooth transition)
    // BlendShift Technology conceived, designed and coded by Joseph Huckaby
    var j, temp;
  
    this.shiftColors(colors, range, amount);
  
    var frame = Math.floor( (amount - Math.floor(amount)) * this.PRECISION );
  
    temp = colors[range.high];
    for (j=range.high-1; j>=range.low; j--)
      colors[j+1] = this.fadeColor(colors[j+1], colors[j], frame, this.PRECISION);
    colors[range.low] = this.fadeColor(colors[range.low], temp, frame, this.PRECISION);
  }
    
  cycle (sourceColors, timeNow, speedAdjust, blendShift) {
    // cycle all animated color ranges in palette based on timestamp
    var i;
    var cycleSize, cycleRate;
    var cycleAmount;
    
    this.copyColors( sourceColors, this.colors );
    
    if (this.ENABLE_CYCLING) {
      for (i=0; i<this.numCycles; i++) {
        var cycle = this.cycles[i];
        if (cycle.rate) {
          cycleSize = (cycle.high - cycle.low) + 1;
          cycleRate = cycle.rate / Math.floor(this.CYCLE_SPEED / speedAdjust);
          
          if (cycle.reverse < 3) {
            // standard cycle
            cycleAmount = this.DFLOAT_MOD((timeNow / (1000 / cycleRate)), cycleSize);
          }
          else if (cycle.reverse == 3) {
            // ping-pong
            cycleAmount = this.DFLOAT_MOD((timeNow / (1000 / cycleRate)), cycleSize * 2);
            if (cycleAmount >= cycleSize) cycleAmount = (cycleSize*2) - cycleAmount;
          } 
          else if (cycle.reverse < 6) {
            // sine wave
            cycleAmount = DFLOAT_MOD((timeNow / (1000 / cycleRate)), cycleSize);
            cycleAmount = Math.sin((cycleAmount * 3.1415926 * 2)/cycleSize) + 1;
            if (cycle.reverse == 4) cycleAmount *= (cycleSize / 4);
            else if (cycle.reverse == 5) cycleAmount *= (cycleSize / 2);
          }
  
          if (cycle.reverse == 2) this.reverseColors(this.colors, cycle);
  
          if (this.USE_BLEND_SHIFT && blendShift) this.blendShiftColors(this.colors, cycle, cycleAmount);
          else this.shiftColors(this.colors, cycle, cycleAmount);
  
          if (cycle.reverse == 2) this.reverseColors(this.colors, cycle);
          
          cycle.cycleAmount = cycleAmount;
        } // active cycle
      } // i loop
    }
  }
    
  fade (destPalette, frame, max) {
    // fade entire palette to another, by adjustable amount
    var idx;
  
    for (idx=0; idx<this.numColors; idx++)
      this.colors[idx] = this.fadeColor(this.colors[idx], destPalette.colors[idx], frame, max);
  }
    
  fadeToColor (color, frame, max) {
    // fade entire palette to a single color, by adjustable amount
    var idx;
  
    for (idx=0; idx<this.numColors; idx++)
      this.colors[idx] = this.fadeColor(this.colors[idx], color, frame, max);
  }
    
  burnOut (frame, max) {
    // burn colors towards black
    var idx, color, amount = Math.floor(255 * (frame / max));
    
    for (idx=0; idx<this.numColors; idx++) {
      color = this.colors[idx];
      color.red -= amount; if (color.red < 0) color.red = 0;
      color.green -= amount; if (color.green < 0) color.green = 0;
      color.blue -= amount; if (color.blue < 0) color.blue = 0;
    }
  }
    
  getRawTransformedColors () {
    // return transformed colors as array of arrays
    var clrs = [];
    for (var idx = 0, len = this.colors.length; idx < len; idx++) {
      var color = this.colors[idx];
      clrs[idx] = [color.red, color.green, color.blue];
    }
    return clrs;
  }
  
}
window.Palette = Palette