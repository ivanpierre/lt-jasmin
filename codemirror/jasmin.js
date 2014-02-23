CodeMirror.defineMode("jasmin", function () {
  var    INSTR = "instr";
  var    LABEL = "label";
  var    CLASS = "class";
  var    DIRECTIVE = "directive";
  var    ACCESS = "access";
  var    BASE = "base";
  var    COMMENT = "comment";
  var    STRING = "string";
  var    CHAR = "char";
  var    TYPE = "atom";
  var    NUMBER = "number";
  var    BRACKET = "bracket";

  var INDENT_WORD_SKIP = 2;

  function makeKeywords(str) {
    var obj = {},
        i,
        words = str.split(" ");
    for (i = 0; i < words.length; i++)
    {
      obj[words[i]] = true;
    }
    return obj;
  }

  var directives = makeKeywords(".class .field .implements .interface .method method .source .super .throws .catch .end .limit .line .throws .var");

  var inst = makeKeywords("aaload aastore aconst_null aload_0 aload_1 aload_2 aload_3 areturn arraylength astore_0 " +
                          "astore_1 astore_2 astore_3 athrow baload bastore breakpoint caload castore d2f d2i d2l " +
                          "dadd daload dastore dcmpg dcmpl dconst_0 dconst_1 ddiv dload_0 dload_1 dload_2 dload_3 " +
                          "dmul dneg drem dreturn dstore_0 dstore_1 dstore_2 dstore_3 dsub dup dup2 dup2_x1 dup2_x2 " +
                          "dup_x1 dup_x2 f2d f2i f2l fadd faload fastore fcmpg fcmpl fconst_0 fconst_1 fconst_2 fdiv " +
                          " fload_0 fload_1 fload_2 fload_3 fmul fneg frem freturn fstore_0 fstore_1 fstore_2 fstore_3 " +
                          "fsub i2d i2f i2l iadd iaload iand iastore iconst_0 iconst_1 iconst_2 iconst_3 iconst_4 " +
                          "iconst_5 iconst_m1 idiv iload_0 iload_1 iload_2 iload_3 imul ineg int2byte int2char int2short " +
                          "ior irem ireturn ishl ishr istore_0 istore_1 istore_2 istore_3 isub iushr ixor l2d l2f l2i " +
                          "ladd laload land lastore lcmp lconst_0 lconst_1 ldiv lload_0 lload_1 lload_2 lload_3 lmul " +
                          "lneg lor lrem lreturn lshl lshr lstore_0 lstore_1 lstore_2 lstore_3 lsub lushr lxor " +
                          "monitorenter monitorexit nop pop pop2 return saload sastore swap " +
                          "ret aload astore dload dstore fload fstore iload istore lload lstore iinc ldc ldc_w " +
                          "anewarray checkcast instanceof new getfield getstatic putfield putstatic " +
                          "invokenonvirtual invokestatic invokevirtual invokeinterface invokespecial newarray multianewarray");


  var inst_label = makeKeywords("goto  goto_w  if_acmpeq if_acmpne if_icmpeq if_icmpge if_icmpgt if_icmple " +
                                "if_icmplt if_icmpne ifeq ifge ifgt ifle iflt ifne ifnonnull ifnull jsr jsr_w");

  var access = makeKeywords(
    "public private protected static final synchronized volatile bridge varargs transient native interface abstract strict synthetic annotation");

  var types = makeKeywords(
    // Built-ins
    "int short char void byte long float double boolean");

  var opposites = {")": "("};

  var tests = {
    digit: /\d/,
    digit_or_colon: /[\d:]/,
    hex: /[0-9a-f]/i,
    sign: /[+\-]/,
    exponent: /e/i,
    char: /[^\s\(\[\{\}\]\)]/,
    keyword_char: /[^\s\(\[\;\)\]]/,
    basic: /[^\s\()]/,
    lang_keyword: /[\w\*\+!\-_?:\/\.#=]/
  };

  function stateStack(indent, type, prev) { // represents a state stack object
    this.indent = indent;
    this.type = type;
    this.prev = prev;
  }

  function isNumber(ch, stream){
    // hex
    if ( ch == '0' && stream.eat(/x/i) ) {
      stream.eatWhile(tests.hex);
      return true;
    }

    // leading sign
    if ( ( ch == '+' || ch == '-' ) && ( tests.digit.test(stream.peek()) ) ) {
      stream.eat(tests.sign);
      ch = stream.next();
    }

    if ( tests.digit.test(ch) ) {
      stream.eat(ch);
      stream.eatWhile(tests.digit);

      if ( '.' == stream.peek() ) {
        stream.eat('.');
        stream.eatWhile(tests.digit);
      }

      if ( stream.eat(tests.exponent) ) {
        stream.eat(tests.sign);
        stream.eatWhile(tests.digit);
      }

      return true;
    }

    return false;
  }

  function eatString(stream) {
    var next, escaped = false;
    while ((next = stream.next()) != null) {
      if (next == "\"" && !escaped) {
        return false;
      }
      escaped = !escaped && next == "\\";
    }
    return "string";
  }

  return {
    startState: function () {
      return {
        indent: 0,
        mode: false
      };
    },

    indent: function (state) {
      return Pass;
    },

    token: function (stream, state) {
      // skip spaces
      if (stream.eatSpace()) {
        return null;
      }
      var returnType = null;

      state.indent = stream.indent;

      switch(state.mode){
        case "string": // multi-line string parsing mode
          state.mode = eatString(stream);
          returnType = STRING; // continue on in string mode
          break;

        case "label": // Label after a jump instruction
          stream.eatWhile(tests.basic);
          state.mode = false;
          returnType = LABEL; // continue on in string mode
          break;

        default: // default parsing mode
          var ch = stream.next();

          if (ch == "\"") {
            state.mode = "string";
            returnType = STRING;
          } else if (ch == "\\") {
            stream.next();
            returnType = CHAR;
          } else if (ch == ";") { // comment
            stream.skipToEnd(); // rest of the line is a comment
            returnType = COMMENT;
          } else if (isNumber(ch,stream)){
            returnType = NUMBER;
          } else if (ch == "(") {
            returnType = BRACKET;
          } else if (ch == ")") {
            returnType = BRACKET;
          } else {
            stream.eatWhile(tests.basic);

            if (directives && directives.propertyIsEnumerable(stream.current())) {
              returnType = DIRECTIVE;
            } else if (inst && inst.propertyIsEnumerable(stream.current())) {
              returnType = INSTR;
            } else if (inst_label && inst_label.propertyIsEnumerable(stream.current())) {
              returnType = INSTR;
              state.mode = "label";
            } else if (access && access.propertyIsEnumerable(stream.current())) {
              returnType = ACCESS;
            } else if (types && types.propertyIsEnumerable(stream.current())) {
              returnType = TYPE;
            } else if (stream.current().search(/w*\<init\>w*/) != -1) {
              returnType = BASE;
            } else if (stream.current().search(/w*\<clinit\>w*/) != -1) {
              returnType = BASE;
            } else if (stream.current().search(/w*\:/) != -1) {
              returnType = LABEL;
            } else if (stream.current().search(/w*\;/) != -1) {
              returnType = CLASS;
            } else {
              returnType = null;
            }
          }
      }

      return returnType;
    },

    // enterMode: "keep",
    disallowSingleQuoteStrings: true
  };
});

CodeMirror.defineMIME("text/x-jasmin", "jasmin");
CodeMirror.defineMIME("j", "jasmin");
