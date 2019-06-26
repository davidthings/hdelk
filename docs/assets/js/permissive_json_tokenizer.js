
var Tokenizer = (function(){

    /**
     * @export {function} .tokenize
     * @param {string} source - Stringification of a permissive JSON object.
     * @return {array} Array of tokens. A token is an object like this: `{}`.
     */
    var OBJ_OPEN = 1;
    var OBJ_CLOSE = 2;
    var ARR_OPEN = 3;
    var ARR_CLOSE = 4;
    var STRING = 5;
    var NUMBER = 6;
    var SPECIAL = 7;  // true, false, null or undefined.
    var COLON = 8;

    var TYPE_NAMES = [
      "???",
      "OBJ_OPEN", "OBJ_CLOSE", "ARR_OPEN", "ARR_CLOSE",
      "STRING", "NUMBER", "SPECIAL", "COLON"
    ];

    var toExport = {
      OBJ_OPEN: OBJ_OPEN,
      OBJ_CLOSE: OBJ_CLOSE,
      ARR_OPEN: ARR_OPEN,
      ARR_CLOSE: ARR_CLOSE,
      STRING: STRING,
      NUMBER: NUMBER,
      SPECIAL: SPECIAL,  // true, false, null or undefined.
      COLON: COLON,
      /**
       * @param {string} source - JSON string to tokenize.
       * @return
       */
      tokenize: function( source ) {
        var ctx = new Context();
        return ctx.tokenize( source );
      },
      getTypeName: function( type ) { return TYPE_NAMES[type]; }
    };


    var Context = function( source ) {
      this.eaters = [
        eatBlanks.bind( this ),
        eatSymbol.bind( this ),
        eatComment.bind( this ),
        eatString.bind( this ),
        eatIdentifier.bind( this )
      ];
    };

    Context.prototype.tokenize = function( source ) {
      this.source = source;
      this.end = source.length;
      this.index = 0;
      this.tokens = [];

      var eater, eaterIndex, currentSourceIndex;

      while( this.index < this.end ) {
        currentSourceIndex = this.index;
        for( eaterIndex = 0 ; eaterIndex < this.eaters.length ; eaterIndex++ ) {
          eater = this.eaters[eaterIndex];
          eater();
          if( this.index !== currentSourceIndex ) break;
        }
        if( this.index === currentSourceIndex ) {
          // No eater has been pleased with this char.
          this.fail();
        }
      }

      return this.tokens;
    };

    /**
     * Check if the current cursor is pointing on a string passed as argument.
     * Multiple arguments are allowed.
     */
    Context.prototype.is = function() {
      var arg, k;
      for( k = 0; k < arguments.length; k++ ) {
        arg = arguments[k];
        if( this.source.substr( this.index, arg.length ) == arg ) return true;
      }
      return false;
    };

    Context.prototype.fail = function(msg) {
      if( typeof msg === 'undefined' ) msg = "Invalid char at " + this.index + "!";

      throw { index: this.index, source: this.source, message: msg };
    };
    Context.prototype.eos = function() { return this.index >= this.end; };
    Context.prototype.peek = function() {
      return this.eos() ? null : this.source[this.index];
    };
    Context.prototype.next = function() {
      return this.eos() ? null : this.source[this.index++];
    };
    Context.prototype.back = function() { if( this.index > 0 ) this.index--; };
    Context.prototype.addToken = function( type, index, text ) {
      if( typeof index === 'undefined' ) index = this.index;
      if( typeof index !== 'number' ) {
        text = index;
        index = this.index;
      }
      this.tokens.push({
        type: type,
        index: index,
        value: text
      });
    }

    function eatBlanks() {
      while( " \t\n\r".indexOf( this.peek() ) !== -1 ) this.index++;
    }


    function eatSymbol() {
      var tkn = null;
      var c = this.peek();
      switch( c ) {
      case '{': tkn = OBJ_OPEN; break;
      case '}': tkn = OBJ_CLOSE; break;
      case '[': tkn = ARR_OPEN; break;
      case ']': tkn = ARR_CLOSE; break;
      case ':': tkn = COLON; break;
      }
      if( c === ',' ) {
        // The comma is not mandatory.
        this.index++;
        return;
      }
      if( tkn ) {
        this.addToken( tkn );
        this.index++;
      }
    }

    function eatComment() {
      var savedIndex = this.index;
      if( this.peek() !== '/' ) return;
      this.index++;
      var c = this.next();
      if( c == '/' ) {
        // Single line comment.
        var endOfSingleComment = this.source.indexOf( '\n', this.index );
        if( endOfSingleComment === -1 ) {
          this.index = this.end;
        } else {
          this.index = endOfSingleComment + 1;
        }
      }
      else if( c == '*' ) {
        // Multi line comment.
        var endOfComment = this.source.indexOf( '*/', this.index );
        if( endOfComment === -1 ) {
          this.index = this.end;
        } else {
          this.index = endOfComment + 1;
        }
      }
      else {
        this.index = savedIndex;
      }
    }

    function eatString() {
      var quote = this.peek();
      if( quote !== '"' && quote !== "'" ) return;
      var start = this.index;
      this.index++;
      var escape = false;
      var str = '';
      var c;
      while( !this.eos() ) {
        c = this.next();
        if( escape ) {
          escape = false;
          if( c == 'n' ) c = '\n';
          else if( c == 'r' ) c = '\r';
          else if( c == 't' ) c = '\t';
          str += c;
        }
        else if( c == "\\" ) {
          escape = true;
        }
        else if( c == quote ) {
          this.addToken( STRING, start, str );
          return;
        }
        else {
          str += c;
        }
      }
      this.index = start;
      this.fail("Missing en of string");
    }

    var RX_DECIMAL = /^-?(\.[0-9]+|[0-9]+(\.[0-9]+)?)([eE]-?[0-9]+)?$/;
    var RX_HEXA = /^-?0x[0-9a-f]+$/i;
    var RX_OCTAL = /^-?0o[0-7]+$/i;
    var RX_BINARY = /^-?0b[01]+$/i;

    function eatIdentifier() {
      var start = this.index;
      var c = this.peek();
      if( " \t\n\r,:[]{}".indexOf(c) !== -1 || this.is("//", "/*") ) return;
      this.index++;
      var str = c;
      while( !this.eos() ) {
        c = this.peek();
        if( " \t\n\r,:[]{}".indexOf(c) !== -1 || this.is("//", "/*") ) break;
        str += c;
        this.index++;
      }
      if( RX_DECIMAL.test( str ) ) {
        this.addToken(NUMBER, start, parseFloat(str) );
      }
      else if( RX_HEXA.test( str ) ) {
        this.addToken(NUMBER, start, parseInt(str, 16) );
      }
      else if( RX_OCTAL.test( str ) ) {
        if( str.charAt(0) == '-' ) {
          str = "-" + str.substr(3);
        } else {
          str = str.substr(2);
        }
        this.addToken(NUMBER, start, parseInt(str, 8) );
      }
      else if( RX_BINARY.test( str ) ) {
        if( str.charAt(0) == '-' ) {
          str = "-" + str.substr(3);
        } else {
          str = str.substr(2);
        }
        this.addToken(NUMBER, start, parseInt(str, 2) );
      }
      else {
        var type = SPECIAL;
        if( str === 'null' ) str = null;
        else if( str === 'undefined' ) str = undefined;
        else if( str === 'true' ) str = true;
        else if( str === 'false' ) str = false;
        else type = STRING;
        this.addToken(type, start, str );
      }
    }

    return toExport;

})();