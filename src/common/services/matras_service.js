var MatrasService = {
  // findModifiers(str, oBracket, cBracket) produces an array of all the
  // content of the "modifiers" in the given korvai string, where a modifier
  // is either a repeater or nadai
  // a repeater is of the form "(thathinkinathom /3)" with parentheses
  // a nadai is of the form "[thathinkinathom /3]" with square brackets
  // TODO: clean this up, it's very messy
  findModifiers: function(str, oBracket, cBracket) {
    var endPos = -1;
    var modifiers = [];

    while(true) {
      while(str.charAt(endPos + 1) != oBracket && endPos < str.length) endPos++;
      if(endPos == str.length) break;

      var openBrackets = 0;
      var startPos = endPos;

      while(true) {
        chr = str.charAt(++endPos);

        if(chr == oBracket) openBrackets++;
        else if(chr == cBracket) openBrackets--;

        if(!(openBrackets > 0 && endPos < str.length)) break;
      }

      if(endPos == str.length) break;

      modifiers.push(str.substring(startPos + 2, endPos));
    }

    return modifiers;
  },

  // repeatString(r) consumes a repeater (as defined above)
  // and produces the repeated sequence as a string (or false if not found)
  // e.g. (thathinkinathom /3) produces "thathinkinathom thathinkinathom thathinkinathom "
  repeatString: function(r) {
    var lastSlash = r.lastIndexOf("/");
    if(lastSlash == -1) return false;

    var rString = r.substring(0, lastSlash);
    var repeaters = this.findModifiers(rString, "(", ")");

    for(var i = 0; i < repeaters.length; i++)
      rString = this.replaceRepeater(rString, repeaters[i]);

    var numOfRepeats = parseInt(r.slice(lastSlash + 1));

    try {
      return rString.repeat(numOfRepeats);
    } catch(error) {
      console.error("ERROR: Invalid repeater syntax: ", error);
      return rString;
    }
  },

  // replaceRepeater(str, r) replaces the occurrences of the repeater
  // in the given string
  replaceRepeater: function(str, r) {
    return str.replace("(" + r + ")", this.repeatString(r));
  },

  // repeaterMatras(r) counts the number of matras in the given repeater
  repeaterMatras: function(r) {
    return this.matrasWithoutModifiers(this.repeatString(r));
  },

  nadaiMatras: function(n) {
    var lastSlash = n.lastIndexOf("/");
    if(lastSlash == -1) return;

    var nString = n.substring(0, lastSlash);

    return this.countMatras(nString, false) * 4 / parseInt(n.slice(lastSlash + 1));
  },

  wordMatras: function(word) {
    var vowels = word.match(/[aeiou]/g);
    if(vowels) return vowels.length;
    else return 0;
  },

  matrasWithoutModifiers: function(korvai) {
    var matras = 0;
    var korvaiWords = korvai.replace(/(\r\n|\n|\r)/gm, ' ').split(' ');

    for(var i = 0; i < korvaiWords.length; i++)
      matras += this.wordMatras(korvaiWords[i]);

    var commas = korvai.match(/,/g);
    matras += (commas ? commas.length : 0);

    var semicolons = korvai.match(/;/g);
    matras += (semicolons ? semicolons.length * 2 : 0);

    return matras;
  },

  // countMatras(korvai) counts the number of matras in the korvai
  // TODO: this only works for 2nd speed
  countMatras: function(korvai, hasNadais) {
    var div = document.createElement("div");
    div.innerHTML = korvai;
    korvai = div.textContent || div.innerText || '';

    var matras = 0;

    if(hasNadais) {
      var nadais = this.findModifiers(korvai, "[", "]");

      for(var i = 0; i < nadais.length; i++) {
        matras += this.nadaiMatras(nadais[i]);
        korvai = korvai.replace("[" + nadais[i] + "]", '');
      }
    }

    var repeaters = this.findModifiers(korvai, "(", ")");

    for(var i = 0; i < repeaters.length; i++) {
      matras += this.repeaterMatras(repeaters[i]);
      korvai = korvai.replace("(" + r + ")", '');
    }

    matras += this.matrasWithoutModifiers(korvai);
    return matras;
  }
};

module.exports = MatrasService;