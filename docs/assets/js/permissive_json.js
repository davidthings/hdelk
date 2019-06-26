"use strict";

var PermissiveJSON = (function(){

    var toExport = {};
    toExport.parse = function( text ) {
      try {
        var tokens = Tokenizer.tokenize( text );
        var parser = new Parser( tokens );
        var result = parser.parse();
        return result;
      }
      catch( ex ) {
        if( typeof ex.type === 'number' ) {
          throw ex;
        } else {
          throw ex;
        }
      }
    };


    var Parser = function(tokens) {
      this.tokens = tokens;
      this.index = 0;
    };


    Parser.prototype.peek = function() {
      return this.tokens[this.index];
    };


    Parser.prototype.next = function() {
      return this.tokens[this.index++];
    };


    Parser.prototype.back = function() {
      this.index = Math.max( 0, this.index - 1 );
    };


    Parser.prototype.parse = function() {
      var tkn = this.next();

      switch( tkn.type ) {
      case Tokenizer.OBJ_OPEN:
        return this.parseObject();
      case Tokenizer.ARR_OPEN:
        return this.parseArray();
      case Tokenizer.STRING:
      case Tokenizer.NUMBER:
      case Tokenizer.SPECIAL:
        return tkn.value;
      }
      this.back();
      this.fail( tkn );
    };


    Parser.prototype.parseArray = function() {
      var start = this.index;
      var arr = [];
      var tkn;
      while( undefined !== (tkn = this.peek()) ) {
        if( tkn.type === Tokenizer.ARR_CLOSE ) {
          this.next();
          return arr;
        }
        arr.push( this.parse() );
      }
      this.fail("Opening braket at position " + start + " has no corresponding closing one!", start);
    };


    Parser.prototype.parseObject = function() {
      var start = this.index;
      var obj = {};
      var tkn;
      var key, val;
      var indexForMissingKey = 0;
      while( undefined !== (tkn = this.peek()) ) {
        if( tkn.type === Tokenizer.OBJ_CLOSE ) {
          this.next();
          return obj;
        }
        key = this.parse();
        tkn = this.peek();
        if( tkn.type === Tokenizer.OBJ_CLOSE ) {
          obj[indexForMissingKey++] = key;
          this.next();
          return obj;
        }
        else if( tkn.type === Tokenizer.COLON ) {
          this.next();
          val = this.parse();
          obj[key] = val;
        }
        else {
          // Missing key.
          obj[indexForMissingKey++] = key;
        }
      }
      this.fail("Opening brace at position " + start + " has no corresponding closing one!", start);
    };


    Parser.prototype.fail = function( tkn, index ) {
      if( typeof tkn === 'string' ) {
        throw { message: tkn, index: index };
      }
      throw {
        index: tkn.index,
        message: "Unexpected token " + Tokenizer.getTypeName(tkn.type) + " at position " + tkn.index + "!"
      };
    };


    return toExport;

})();