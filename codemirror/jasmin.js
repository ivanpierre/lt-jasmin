CodeMirror.defineMode("jasmin", function () {
  var BUILTIN = "builtin", COMMENT = "comment", COMMENTFORM = "comment comment-form"; STRING = "string", CHAR = "char",
      ATOM = "atom", NUMBER = "number", BRACKET = "bracket", KEYWORD = "keyword";
  var INDENT_WORD_SKIP = 2;

  function makeKeywords(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
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

  var atoms = makeKeywords("true false nil");

  var keywords = makeKeywords(
    "defn defn- def def- defonce defmulti defmethod defmacro defstruct deftype defprotocol defrecord defproject deftest slice defalias defhinted defmacro- defn-memo defnk defnk defonce- defunbound defunbound- defvar defvar- let letfn do case cond condp for loop recur when when-not when-let when-first if if-let if-not . .. -> ->> doto and or dosync doseq dotimes dorun doall load import unimport ns in-ns refer try catch finally throw with-open with-local-vars binding gen-class gen-and-load-class gen-and-save-class handler-case handle");

  var builtins = makeKeywords(
    "* *' *1 *2 *3 *agent* *allow-unresolved-vars* *assert* *clojure-version* *command-line-args* *compile-files* *compile-path* *compiler-options* *data-readers* *e *err* *file* *flush-on-newline* *fn-loader* *in* *math-context* *ns* *out* *print-dup* *print-length* *print-level* *print-meta* *print-readably* *read-eval* *source-path* *unchecked-math* *use-context-classloader* *verbose-defrecords* *warn-on-reflection* + +' - -' -> ->> ->ArrayChunk ->Vec ->VecNode ->VecSeq -cache-protocol-fn -reset-methods .. / < <= = == > >= EMPTY-NODE accessor aclone add-classpath add-watch agent agent-error agent-errors aget alength alias all-ns alter alter-meta! alter-var-root amap ancestors and apply areduce array-map aset aset-boolean aset-byte aset-char aset-double aset-float aset-int aset-long aset-short assert assoc assoc! assoc-in associative? atom await await-for await1 bases bean bigdec bigint biginteger binding bit-and bit-and-not bit-clear bit-flip bit-not bit-or bit-set bit-shift-left bit-shift-right bit-test bit-xor boolean boolean-array booleans bound-fn bound-fn* bound? butlast byte byte-array bytes case cast char char-array char-escape-string char-name-string char? chars chunk chunk-append chunk-buffer chunk-cons chunk-first chunk-next chunk-rest chunked-seq? class class? clear-agent-errors clojure-version coll? comment commute comp comparator compare compare-and-set! compile complement concat cond condp conj conj! cons constantly construct-proxy contains? count counted? create-ns create-struct cycle dec dec' decimal? declare default-data-readers definline definterface defmacro defmethod defmulti defn defn- defonce defprotocol defrecord defstruct deftype delay delay? deliver denominator deref derive descendants destructure disj disj! dissoc dissoc! distinct distinct? doall dorun doseq dosync dotimes doto double double-array doubles drop drop-last drop-while empty empty? ensure enumeration-seq error-handler error-mode eval even? every-pred every? ex-data ex-info extend extend-protocol extend-type extenders extends? false? ffirst file-seq filter filterv find find-keyword find-ns find-protocol-impl find-protocol-method find-var first flatten float float-array float? floats flush fn fn? fnext fnil for force format frequencies future future-call future-cancel future-cancelled? future-done? future? gen-class gen-interface gensym get get-in get-method get-proxy-class get-thread-bindings get-validator group-by hash hash-combine hash-map hash-set identical? identity if-let if-not ifn? import in-ns inc inc' init-proxy instance? int int-array integer? interleave intern interpose into into-array ints io! isa? iterate iterator-seq juxt keep keep-indexed key keys keyword keyword? last lazy-cat lazy-seq let letfn line-seq list list* list? load load-file load-reader load-string loaded-libs locking long long-array longs loop macroexpand macroexpand-1 make-array make-hierarchy map map-indexed map? mapcat mapv max max-key memfn memoize merge merge-with meta method-sig methods min min-key mod munge name namespace namespace-munge neg? newline next nfirst nil? nnext not not-any? not-empty not-every? not= ns ns-aliases ns-imports ns-interns ns-map ns-name ns-publics ns-refers ns-resolve ns-unalias ns-unmap nth nthnext nthrest num number? numerator object-array odd? or parents partial partition partition-all partition-by pcalls peek persistent! pmap pop pop! pop-thread-bindings pos? pr pr-str prefer-method prefers primitives-classnames print print-ctor print-dup print-method print-simple print-str printf println println-str prn prn-str promise proxy proxy-call-with-super proxy-mappings proxy-name proxy-super push-thread-bindings pvalues quot rand rand-int rand-nth range ratio? rational? rationalize re-find re-groups re-matcher re-matches re-pattern re-seq read read-line read-string realized? reduce reduce-kv reductions ref ref-history-count ref-max-history ref-min-history ref-set refer refer-clojure reify release-pending-sends rem remove remove-all-methods remove-method remove-ns remove-watch repeat repeatedly replace replicate require reset! reset-meta! resolve rest restart-agent resultset-seq reverse reversible? rseq rsubseq satisfies? second select-keys send send-off seq seq? seque sequence sequential? set set-error-handler! set-error-mode! set-validator! set? short short-array shorts shuffle shutdown-agents slurp some some-fn sort sort-by sorted-map sorted-map-by sorted-set sorted-set-by sorted? special-symbol? spit split-at split-with str string? struct struct-map subs subseq subvec supers swap! symbol symbol? sync take take-last take-nth take-while test the-ns thread-bound? time to-array to-array-2d trampoline transient tree-seq true? type unchecked-add unchecked-add-int unchecked-byte unchecked-char unchecked-dec unchecked-dec-int unchecked-divide-int unchecked-double unchecked-float unchecked-inc unchecked-inc-int unchecked-int unchecked-long unchecked-multiply unchecked-multiply-int unchecked-negate unchecked-negate-int unchecked-remainder-int unchecked-short unchecked-subtract unchecked-subtract-int underive unquote unquote-splicing update-in update-proxy use val vals var-get var-set var? vary-meta vec vector vector-of vector? when when-first when-let when-not while with-bindings with-bindings* with-in-str with-loading-context with-local-vars with-meta with-open with-out-str with-precision with-redefs with-redefs-fn xml-seq zero? zipmap *default-data-reader-fn* as-> cond-> cond->> reduced reduced? send-via set-agent-send-executor! set-agent-send-off-executor! some-> some->>");

  var indentKeys = makeKeywords(
    // Built-ins
    "ns fn def defn defmethod bound-fn if if-not case condp when while when-not when-first do future comment doto locking proxy with-open with-precision reify deftype defrecord defprotocol extend extend-protocol extend-type try catch " +

    // Binding forms
    "let letfn binding loop for doseq dotimes when-let if-let " +

    // Data structures
    "defstruct struct-map assoc " +

    // clojure.test
    "testing deftest " +

    // contrib
    "handler-case handle dotrace deftrace");

  var opposites = {")": "("};

  var tests = {
    digit: /\d/,
    digit_or_colon: /[\d:]/,
    hex: /[0-9a-f]/i,
    sign: /[+-]/,
    exponent: /e/i,
    char: /[^\s\(\[\{\}\]\)]/,
    keyword_char: /[^\s\(\[\;\)\]]/,
    basic: /[^\s\()]/,
    lang_keyword: /[\w\*\+!\-_?:\/\.#=]/,
  };

  function stateStack(indent, type, prev) { // represents a state stack object
    this.indent = indent;
    this.type = type;
    this.prev = prev;
  }

  function isNumber(ch, stream){
    // hex
    if ( ch === '0' && stream.eat(/x/i) ) {
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
        indentStack: null,
        indent: 0,
        mode: false
      };
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
              returnType = KEYWORD;
            } else if (inst && inst.propertyIsEnumerable(stream.current())) {
              returnType = BUILTIN;
            } else if (inst_label && inst_label.propertyIsEnumerable(stream.current())) {
              returnType = BUILTIN;
            } else if (access && access.propertyIsEnumerable(stream.current())) {
              returnType = ATOM;
            } else if (types && types.propertyIsEnumerable(stream.current())) {
              returnType = ATOM;
            } else if (stream.current().search(/w*\:/)!=-1) {
              returnType = ATOM;
            } else if (stream.current().search(/w*\;/)!=-1) {
              returnType = ATOM;
            } else returnType = null;
          }
            }

          return returnType;
        },

      indent: function (state, textAfter) {
        if (state.indentStack == null)
          return state.indent;
        return state.indentStack.indent;
      },

    commentForms: false,

      lineComment: "//",
      disallowSingleQuoteStrings: true
    };
});

CodeMirror.defineMIME("text/x-jasmin", "jasmin");
CodeMirror.defineMIME("j", "jasmin");
