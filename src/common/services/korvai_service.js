var MatrasService = require('./matras_service.js');

var KorvaiService = {
  toMsx: function(korvai) {
    var korvaiWords = this.addWhitespace(korvai).match(/([a-zA-z\(\)\[\]\n]+|\/[0-9]+)/g);
    return <div class="korvai-content">{this.formatWords(korvaiWords)}</div>;
  },

  formatMatraCount: function(korvai, thalam) {
    var totalMatras = this.countMatras(korvai);

    var avarthanams = Math.floor(totalMatras / thalam);
    var avarthanamsPhrase = avarthanams.toString() + " avarthanam" + (avarthanams !== 1 ? "s" : "") + ", ";

    var matrasRemaining = totalMatras % thalam;
    var matrasPhrase = matrasRemaining + " matra" + (matrasRemaining !== 1 ? "s" : "");

    return avarthanamsPhrase + matrasPhrase;
  },

  countMatras: function(korvai) {
    return MatrasService.countMatras(korvai, true);
  },

  // -------- PRIVATE --------

  formatWords: function(wordList, modifierOpeningBracket) {
    var children = [];
    // if formatWords is called on a repeater or a nadai enclosed in brackets
    if(modifierOpeningBracket) {
      children.push(<span class="modifier-bracket">{modifierOpeningBracket}&nbsp;</span>);
    }

    // only go to the 2nd last element because the last one contains the number for modification
    for(var i = 0; i < wordList.length - (modifierOpeningBracket ? 1 : 0); i++) {
      var word = wordList[i];
      var openingBracket = this.openingBracket(word);

      // if there's an opening bracket, then a modifier begins
      if(openingBracket) {
        var j = i;
        var brackets = 0;

        while(j < wordList.length) {
          word = wordList[++j];
          if(this.openingBracket(word)) brackets++;
          else if(this.closingBracket(word) && !brackets) break;
          else if(this.closingBracket(word)) brackets--;
        }

        if(j == wordList.length) {
          console.error('invalid korvai');
        } else {
          var modified = wordList.slice(i+1, j);
          children.push(this.formatWords(modified, openingBracket));
          i = j;
        }
      } else if(word == "\n") {
        children.push(<br />);
      } else {
        children.push(<span>{word}<sup>{this.countMatras(word)}</sup> </span>);
      }
    }

    // close the bracket if formatWords was called with an enclosed modifier
    if(modifierOpeningBracket) {
      children.push(<span class="modifier-bracket">&nbsp;{(modifierOpeningBracket == '(' ? ')' : ']')}</span>);
      if(modifierOpeningBracket == '(') {
        children.push(" × " + wordList[i].substring(1));
      } else {
        children.push(" → " + this.numberToNadai(parseInt(wordList[i].substring(1))));
      }
    }

    return children;
  },

  // adds spaces between all the misc. characters and whitespace
  addWhitespace: function(korvai) {
    return korvai.replace(/([,;\(\)\[\]\n]|\/[0-9]+)/g, ' $1 ');
  },

  openingBracket: function(str) {
    return (str == '(' || str == '[' ? str : false);
  },

  closingBracket: function(str) {
    return (str == ')' || str == ']' ? str : false);
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
  }
};

module.exports = KorvaiService;