var MatrasService = require('./matras_service.js');
var msx = require('msx');

var KorvaiService = {
  toMsx: function(korvai) {
    return eval('(' + msx.transform(this.renderHTML(korvai)) + ')');
  },

  renderHTML: function(korvai) {
    return '<div class="korvai-content">' + this.korvaiToHTML(korvai) + '</div>';
  },

  countMatras: function(korvai) {
    return MatrasService.countMatras(korvai, true);
  },

  // -------- PRIVATE --------

  convertRepeater: function(r) {
    var lastSlash = r.lastIndexOf("/");
    if(lastSlash == -1) return;

    var rString = r.substring(0, lastSlash);
    var repeaters = MatrasService.findModifiers(rString, "(", ")");

    for(var i = 0; i < repeaters.length; i++)
      rString = this.replaceRepeater(rString, repeaters[i]);

    return '<span class="modifier-bracket">(</span>' + rString + '<span class="modifier-bracket">)</span> ×' + r.slice(lastSlash + 1);
  },

  replaceRepeater: function(str, r) {
    return str.replace("(" + r + ")", this.convertRepeater(r));
  },

  convertNadai: function(n) {
    var lastSlash = n.lastIndexOf("/");
    if(lastSlash == -1) return;

    var nString = n.substring(0, lastSlash);
    return '<span class="modifier-bracket">[</span>' + nString + '<span class="modifier-bracket">]</span> → ' + this.numberToNadai(parseInt(n.slice(lastSlash + 1)));
  },

  numberToNadai: function(num) {
    switch(num) {
      case 3:
        return "thisram";
      case 4:
        return "chatusram";
      case 5:
        return "kandam";
      case 6:
        return "mael thisram";
      case 7:
        return "misram";
      case 8:
        return "mael chatusram";
      case 9:
        return "sankeernam";
    }
  },

  grabContent: function(content) {
    content = content.replaceAll("<br>", "\n");
    var div = document.createElement("div");
    div.innerHTML = content;
    content = div.textContent || div.innerText || "";
    return content;
  },

  korvaiToHTML: function(korvai) {
    if(korvai == "" || korvai == null) return "";
    
    // TODO: understand why you need 4 backslashes for the newline replace
    korvai = korvai.replaceAll(",", " , ").replaceAll(";", " ; ").replaceAll("\\\\n", " \n ");
    var korvaiWords = korvai.match(/([a-zA-Z]+)/g).removeDuplicates();

    for(var i = 0; i < korvaiWords.length; i++) {
      var word = korvaiWords[i];
      korvai = korvai.replaceAll("\\b" + word + "\\b", " " + word + "<sup>" + MatrasService.wordMatras(word) + "</sup> ");
    }

    var repeaters = MatrasService.findModifiers(korvai, "(", ")");
    for(var i = 0; i < repeaters.length; i++) {
      var r = repeaters[i];
      korvai = korvai.replace("(" + r + ")", this.convertRepeater(r));
    }

    var nadais = MatrasService.findModifiers(korvai, "[", "]")
    for(var i = 0; i < nadais[i]; i++) {
      var n = nadais[i];
      korvai = korvai.replace("[" + n + "]", this.convertNadai(n));
    }

    korvai = korvai.replaceAll("\n", "<br />");

    return korvai;
  }
};

module.exports = KorvaiService;