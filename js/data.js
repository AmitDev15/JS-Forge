/* ============================================================
   COURSE DATA — derived from the lecture PDFs (L1–L4 + Type Conversion)
   All content fixed: no closures card (not taught), accurate parseInt note,
   honest tracer scope, single XP source.
   ============================================================ */

const COURSE = {
  lessons: [

  /* ===================== LECTURE 01 ===================== */
  {
    id:"l1", num:"Lecture 01", title:"Introduction to JavaScript", level:"beg", time:"12 min",
    blurb:"The origin story — why JS exists, the browser wars, and why it still rules the web.",
    summary:[
      "The early-1990s web was static; pages couldn't react instantly.",
      "Netscape + Sun partnered against Microsoft; Java went into browsers.",
      "Java was too heavy/sealed for small 'glue' jobs, so a second language was needed.",
      "Brendan Eich built JS in ~10 days (May 1995); marketing forced it to 'look like Java'.",
      "C++ was unsafe (full system access) and impossible on 4–8 MB machines; JS is safe and garbage-collected.",
      "JS won by being woven into the page and always present — the 'glue' role survives even with WebAssembly."
    ],
    blocks:[
      {t:"prose", ic:"01", h:"The web was born dead", html:`
        <p class="lead">In the early 1990s a web page was a static document — text and images, nothing more. It could not react to you.</p>
        <p>Fill a form wrong and the page couldn't tell you on the spot; your data travelled to a distant server and back just to say "try again." <strong>Netscape</strong>, maker of the dominant browser, realised the web needed to come alive and respond instantly inside the page. That need is the seed of everything.</p>`},
      {t:"analogy", html:`<p>A static page was a <strong>printed menu</strong>: you can read it, but point at a dish and it can't tell you it's sold out. JavaScript is the <strong>waiter</strong> beside the menu — reacting, answering, updating on the spot.</p>`},
      {t:"prose", ic:"02", h:"Java and the war on Microsoft", html:`
        <p>Sun Microsystems had <strong>Java</strong> and its promise: "write once, run anywhere." In 1995 Sun and Netscape partnered to put Java in the browser — partly to weaken a shared enemy, <strong>Microsoft</strong>.</p>
        <p>Everyone needed Windows to run software, so Microsoft owned the ground all software stood on. The dream: run all software <em>inside the browser</em>, making the OS irrelevant — Windows reduced to "a particularly expensive way to switch the computer on."</p>`},
      {t:"prose", ic:"03", h:"Why a SECOND language", html:`
        <p>If Java was already in the browser, why invent JavaScript? Because Java was the wrong <em>shape</em> for small "glue" work: it ran in a <strong>sealed box</strong> and couldn't easily touch the page, was <strong>too heavyweight</strong> to start up (a truck to open a garage door), and was <strong>too hard</strong> for the web designers meant to use it.</p>`},
      {t:"table", title:"Java vs JavaScript in the browser", head:["Java — component language","JavaScript — glue language"], rows:[
        ["Powerful, fast, full-featured","Light, simple, forgiving"],
        ["Written by professional programmers","Written by web designers"],
        ["Ran in a sealed box (applet)","Woven into the page itself"],
        ["Could NOT easily touch the page","Could touch any button, text, element"],
        ["Needed a plugin + slow startup","Built in, ran instantly"],
        ["Removed from browsers (~2015–2017)","Became the language of the web"]
      ]},
      {t:"prose", ic:"04", h:"Ten days in May", html:`
        <p>Netscape hired <strong>Brendan Eich</strong>; the prototype was written in roughly <strong>ten days in May 1995</strong>. A marketing constraint shaped it: because of the Sun deal, the language had to <em>look like Java</em> to ride its fame. That ruled out adopting Python or Perl. The name was pure marketing — <strong>Java and JavaScript are as related as "car" and "carpet."</strong></p>`},
      {t:"diagram", title:"How code reaches the CPU", html:`
        <div class="flow">
          <div class="node">C++ source</div><span class="arr">→</span>
          <div class="node">Compiler</div><span class="arr">→</span>
          <div class="node">Machine code</div><span class="arr">→</span>
          <div class="node inv">CPU</div>
        </div>
        <div class="flow" style="margin-top:14px">
          <div class="node">JS source</div><span class="arr">→</span>
          <div class="node">JS engine (V8 / SpiderMonkey)</div><span class="arr">→</span>
          <div class="node inv">Runs instantly</div>
        </div>`},
      {t:"prose", ic:"05", h:"Why not just use C++?", html:`
        <ul>
          <li><strong>Security nightmare</strong> — raw C++ can read/write any file, run <code>system("format C:")</code>, poke memory, open sockets. A website could wipe your drive.</li>
          <li><strong>Tiny 1995 machines</strong> — 4–8 MB RAM, 200–500 MB disks. A sandboxed C++ runtime would eat all of it.</li>
          <li><strong>Manual memory</strong> — C++ makes you allocate and free by hand. JS has automatic garbage collection.</li>
        </ul>`},
      {t:"callout", k:"warn", tag:"Sandbox", html:`<p>JS runs in a <strong>sandbox</strong>: it can change the page, respond to clicks, make HTTP requests, and ask permission for camera/mic — but it <strong>cannot</strong> freely read your files, open raw sockets, touch OS memory, or crash your system.</p>`},
      {t:"prose", ic:"06", h:"How the little brother won", html:`
        <ul>
          <li><strong>No plugin, no waiting</strong> — JS was already inside every browser and ran instantly.</li>
          <li><strong>Security</strong> — the Java plugin became a notorious source of holes.</li>
          <li><strong>JS caught up</strong> — from ~2011 fast engines erased Java's speed edge.</li>
          <li><strong>It lived in the page</strong> — Java sat in a box; JS was woven into the document.</li>
        </ul>
        <p>Today <strong>WebAssembly</strong> runs C++/Rust fast in the browser — but it still can't touch the page; it must call JavaScript. The word "glue" from 1995 still describes JS perfectly.</p>`},
      {t:"playground", title:"hello.js", code:`// JavaScript is forgiving and runs instantly.
console.log("Hello, World!");
console.log("Built in about 10 days, in 1995.");
console.log(2025 - 1995 + " years of JavaScript");`}
    ],
    interview:[
      {lvl:"beg", q:"Who created JavaScript and roughly how long did it take?", a:"Brendan Eich at Netscape — the prototype took about ten days in May 1995."},
      {lvl:"beg", q:"Are Java and JavaScript the same language?", a:"No. The name was marketing to ride Java's fame. They're largely unrelated — 'car' and 'carpet'."},
      {lvl:"beg", q:"Why was a second language needed if Java was already in the browser?", a:"Java was wrong for small 'glue' jobs: sealed in a box, heavyweight to start, and too hard for web designers."},
      {lvl:"beg", q:"Why couldn't C++ run directly in the browser?", a:"Unsafe (file/memory/system access), too resource-heavy for 1995 machines, and requires manual memory management."},
      {lvl:"beg", q:"Name two JS engines and their browsers.", a:"V8 powers Chrome (and Node.js); SpiderMonkey powers Firefox."},
      {lvl:"int", q:"What is the browser sandbox and why does it matter?", a:"It restricts JS from the host system — no free file access, raw sockets, or OS memory — so a malicious site can't harm your computer."},
      {lvl:"int", q:"How does JS manage memory vs C++?", a:"JS uses automatic garbage collection; C++ requires manual allocate/free, which causes leaks."},
      {lvl:"int", q:"Why was Eich told to make JS 'look like Java'?", a:"The Sun–Netscape partnership wanted to ride Java's popularity, so the new language got C-style braces and semicolons despite different roots."},
      {lvl:"adv", q:"How is WebAssembly a repeat of the Java story?", a:"Wasm runs powerful languages fast in the browser like Java did, but still can't touch the DOM — it must call JavaScript. JS keeps the 'glue' role."},
      {lvl:"adv", q:"What was Microsoft's real fear, and did it come true?", a:"That browser-hosted software would make Windows irrelevant. It partly came true via web apps — but delivered by JavaScript, not Java."}
    ],
    practice:[
      {lvl:"beg", q:"Print 'Hello World' to the console.", a:"<code>console.log(\"Hello World\");</code>"},
      {lvl:"beg", q:"In one sentence, contrast Java's and JavaScript's 'shape' in 1995.", a:"Java was the heavyweight component in a sealed box; JavaScript was the lightweight glue woven into the page."},
      {lvl:"med", q:"List three security risks of running raw C++ from a website.", a:"Unrestricted file access, arbitrary system calls (e.g. wiping the drive), and raw socket/network access."},
      {lvl:"med", q:"Why did 4–8 MB RAM make a C++ browser runtime impractical?", a:"That memory was shared with Windows and the browser; a heavy runtime would consume it all, with no disk room for big libraries."},
      {lvl:"hard", q:"Will WebAssembly replace JavaScript? Argue using the lecture's framing.", a:"No — Wasm is the new heavyweight component but can't touch the DOM, so it must call JS for interactivity. JS keeps the durable 'glue' role even as the component language changes."}
    ],
    quiz:[
      {q:"When was the JavaScript prototype built?", opts:["1991, over 2 years","1995, in ~10 days","2000, in 6 months","1989, in a week"], ans:1, exp:"Brendan Eich built it in about ten days in May 1995."},
      {q:"Java and JavaScript are…", opts:["The same language","Two versions of one language","Largely unrelated (marketing name)","Both made by Microsoft"], ans:2, exp:"The name borrowed Java's fame; the languages are largely unrelated."},
      {q:"Which engine powers Chrome?", opts:["SpiderMonkey","V8","JVM","Chakra"], ans:1, exp:"V8 powers Chrome and Node.js; SpiderMonkey powers Firefox."},
      {q:"WebAssembly can change a button on the page without JavaScript.", opts:["True","False"], ans:1, exp:"Wasm cannot touch the DOM directly — it must call JavaScript."},
      {q:"Main reason C++ was unsuitable for the browser?", opts:["Too slow","Unsafe and resource-heavy","Nobody knew it","It had no loops"], ans:1, exp:"Low-level system access plus huge resource needs on 1995 machines."}
    ],
    flashcards:[
      {q:"Who built JavaScript & when?", a:"Brendan Eich at Netscape, ~10 days in May 1995."},
      {q:"Java vs JavaScript?", a:"Largely unrelated — 'car' vs 'carpet'. Name was marketing."},
      {q:"Chrome's JS engine?", a:"V8 (Firefox uses SpiderMonkey)."},
      {q:"Why not C++ in the browser?", a:"Unsafe system access + too heavy for 4–8 MB machines + manual memory."},
      {q:"JavaScript's lasting role?", a:"The 'glue' — even WebAssembly must call JS to touch the page."}
    ]
  },

  /* ===================== LECTURE 02 ===================== */
  {
    id:"l2", num:"Lecture 02", title:"Variables & Data Types", level:"beg", time:"15 min",
    blurb:"Primitives, objects, const/let/var, typeof, and value vs reference.",
    summary:[
      "Data types label bits: how many bytes, and which operations are valid.",
      "JS is dynamically typed — variables hold any type, decided at runtime.",
      "const = default (no reassignment; objects still mutable); let = reassignable; var = function-scoped, avoid.",
      "let/const live in the TDZ until declared (ReferenceError if accessed early); var hoists to undefined.",
      "7 primitives: string, number, boolean, undefined, null, bigint, symbol — immutable, copied by value.",
      "Objects (incl. arrays & functions) are mutable and copied by reference.",
      "typeof null === 'object' (famous bug); typeof function === 'function'."
    ],
    blocks:[
      {t:"prose", ic:"01", h:"Why data types exist", html:`
        <p class="lead">Memory is just 0s and 1s. The bits <code>01001000</code> could mean the number 72, the character 'H', or part of an address.</p>
        <p>A <strong>data type</strong> is a label telling the computer two things: how many <strong>bytes</strong> to use, and what <strong>operations</strong> are valid (can you multiply it? uppercase it?).</p>`},
      {t:"analogy", html:`<p>Types are <strong>labels on identical cardboard boxes</strong>. Without a label you don't know if a box holds books (stack heavy) or glass (fragile). The label tells you how to handle what's inside.</p>`},
      {t:"prose", ic:"02", h:"JavaScript's choice", html:`
        <p>Java forces <code>int x = 5;</code>. Eich was building for <strong>web designers, not programmers</strong>, so he let a variable hold <strong>any type</strong>, figured out <strong>at runtime</strong>. That decision created everything interesting (and annoying) about JS types.</p>`},
      {t:"prose", ic:"03", h:"const, let, var", html:`
        <p><strong>const</strong> — block-scoped, no reassignment, must be initialized. Freezes only the <em>reference</em>: a const object's properties can still change.</p>
        <p><strong>let</strong> — block-scoped, reassignable, init optional (defaults to <code>undefined</code>).</p>
        <p><strong>var</strong> — function-scoped (ignores blocks), reassignable and redeclarable, hoisted to <code>undefined</code>. Avoid in modern code.</p>`},
      {t:"analogy", html:`<p>A labelled jar: <strong>let</strong> you can empty and refill; <strong>const</strong> is glued to the shelf (can't swap the jar, but can eat individual pieces inside); <strong>var</strong> is an old jar that leaks its contents across the whole room (function scope).</p>`},
      {t:"code", html:`<span class="cmt">// var: hoisted as undefined</span>
console.<span class="fn">log</span>(myVar); <span class="cmt">// undefined (no error)</span>
<span class="kw">var</span> myVar = <span class="str">"Hello"</span>;

<span class="cmt">// let/const: Temporal Dead Zone</span>
<span class="cmt">// console.log(x); // ReferenceError</span>
<span class="kw">let</span> x = <span class="num">100</span>;

<span class="cmt">// const freezes the reference, not the object</span>
<span class="kw">const</span> CONFIG = { port: <span class="num">8080</span> };
CONFIG.port = <span class="num">3000</span>; <span class="cmt">// allowed!</span>`},
      {t:"table", title:"var vs let vs const", head:["Feature","var","let","const"], rows:[
        ["Scope","Function","Block","Block"],
        ["Reassignable","Yes","Yes","No"],
        ["Redeclarable","Yes","No","No"],
        ["Hoisted value","undefined","TDZ","TDZ"],
        ["Modern practice","Avoid","Reassignables","Default"]
      ]},
      {t:"prose", ic:"04", h:"The 7 primitives", html:`
        <p>Primitives are <strong>immutable</strong> and stored <strong>by value</strong>:</p>
        <ul>
          <li><strong>string</strong> — text in <code>'…'</code>, <code>"…"</code>, or backticks (template literals embed <code>\${expr}</code>).</li>
          <li><strong>number</strong> — one type for ints and floats; specials <code>Infinity</code>, <code>NaN</code>.</li>
          <li><strong>boolean</strong> — <code>true</code> / <code>false</code>.</li>
          <li><strong>undefined</strong> — declared but unassigned (engine's emptiness).</li>
          <li><strong>null</strong> — intentional "no value" you assign.</li>
          <li><strong>bigint</strong> — huge integers, suffix <code>n</code>.</li>
          <li><strong>symbol</strong> — unique identifier; every <code>Symbol()</code> is unique.</li>
        </ul>`},
      {t:"diagram", title:"The type tree", html:`
        <pre class="tree">Every JS value
├─ Primitives  (by value, immutable)
│  ├─ string    → text
│  ├─ number    → ints & floats
│  ├─ boolean   → true / false
│  ├─ undefined → not assigned
│  ├─ null      → intentionally empty
│  ├─ bigint    → huge integers
│  └─ symbol    → unique id
└─ Objects     (by reference, mutable)
   ├─ {}        → key → value
   ├─ []        → ordered lists
   └─ function  → reusable code</pre>`},
      {t:"prose", ic:"05", h:"Value vs reference", html:`
        <p><strong>Primitives copy by value</strong> — the copy is independent. <strong>Objects copy by reference</strong> — both names point to the same object, so changing one changes "both."</p>`},
      {t:"playground", title:"value-vs-reference.js", code:`// Primitive: copied by value
let a = 10;
let b = a;
b = 99;
console.log("a =", a, " b =", b);  // a=10  b=99

// Object: copied by reference
let o1 = { score: 10 };
let o2 = o1;        // same reference
o2.score = 99;
console.log("o1.score =", o1.score); // 99 !
console.log("o2.score =", o2.score); // 99`},
      {t:"prose", ic:"06", h:"typeof", html:`
        <p><code>typeof</code> reports a type at runtime. Two surprises: functions report <code>"function"</code>, and <code>typeof null</code> reports <code>"object"</code> — a long-standing bug. Use <code>=== null</code> to check for null.</p>`},
      {t:"playground", title:"typeof.js", code:`console.log(typeof "Hello");      // "string"
console.log(typeof 42);           // "number"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof 10n);          // "bigint"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof { a: 1 });     // "object"
console.log(typeof [1,2,3]);      // "object"
console.log(typeof function(){}); // "function"
console.log(typeof null);         // "object"  <- famous bug!`}
    ],
    interview:[
      {lvl:"beg", q:"What is a data type, fundamentally?", a:"A label telling the computer how many bytes a value uses and which operations are valid on it."},
      {lvl:"beg", q:"List the 7 primitive types.", a:"string, number, boolean, undefined, null, bigint, symbol."},
      {lvl:"beg", q:"null vs undefined?", a:"undefined is the default for a declared-but-unassigned variable; null is an explicit 'no value' you assign."},
      {lvl:"beg", q:"Which keyword is the default?", a:"const — use let only when reassigning, and avoid var."},
      {lvl:"beg", q:"What does typeof return for an array?", a:'"object" — arrays are a specialized object.'},
      {lvl:"int", q:"Explain scope of var vs let/const.", a:"var is function-scoped (ignores blocks); let/const are block-scoped (only inside their { })."},
      {lvl:"int", q:"What is the Temporal Dead Zone?", a:"From the start of a block until a let/const declaration, the variable is hoisted but uninitialized — accessing it throws ReferenceError."},
      {lvl:"int", q:"Can you mutate a const object? Why?", a:"Yes — const freezes only the reference, not the value. Use Object.freeze() to lock contents (shallow)."},
      {lvl:"int", q:"Why does typeof null return 'object'?", a:"A long-standing bug kept for backward compatibility."},
      {lvl:"adv", q:"Pass by value vs reference?", a:"Primitives copy the value (independent). Objects copy the reference (shared) — mutating one variable affects all that point to the same object."},
      {lvl:"adv", q:"Why is every Symbol() unique?", a:"They're designed as unique identifiers; the description is just a label, so Symbol('id') === Symbol('id') is false."}
    ],
    practice:[
      {lvl:"beg", q:"Declare a constant PI = 3.14159 and a reassignable counter = 0.", a:"<code>const PI = 3.14159;</code> &nbsp; <code>let counter = 0;</code>"},
      {lvl:"beg", q:"What does typeof null return, and why is it a bug?", a:"<code>\"object\"</code>. A historical implementation bug kept for backward compatibility; use <code>=== null</code>."},
      {lvl:"med", q:"const c={n:1}; c.n=5; console.log(c.n) — does it error?", a:"No error — prints <code>5</code>. const freezes the reference, not the properties."},
      {lvl:"med", q:"o1={x:1}; o2=o1; o2.x=99; console.log(o1.x). Why?", a:"<code>99</code> — o2 shares o1's reference; both point to one object."},
      {lvl:"hard", q:"What is the TDZ and how does it differ for var vs let/const?", a:"var is hoisted to undefined (usable early). let/const are hoisted but uninitialized in the TDZ — early access throws ReferenceError."}
    ],
    quiz:[
      {q:"How many primitive types does JS have?", opts:["5","6","7","8"], ans:2, exp:"string, number, boolean, undefined, null, bigint, symbol."},
      {q:"Output? var x; console.log(x);", opts:["null","undefined","ReferenceError","0"], ans:1, exp:"var is hoisted and initialized to undefined."},
      {q:"typeof null evaluates to…", opts:['"null"','"object"','"undefined"','"none"'], ans:1, exp:"A famous historical bug; use === null."},
      {q:"Correct default keyword in modern JS?", opts:["var","let","const","def"], ans:2, exp:"const by default; let when reassigning."},
      {q:"A const array's elements can be changed.", opts:["True","False"], ans:0, exp:"const freezes the reference, not the contents."},
      {q:"Output? let a=5; let b=a; b=9; console.log(a);", opts:["5","9","undefined","NaN"], ans:0, exp:"Primitives copy by value — a stays 5."}
    ],
    flashcards:[
      {q:"const vs let?", a:"const: no reassignment (object still mutable). let: reassignable. Both block-scoped."},
      {q:"undefined vs null?", a:"undefined = engine's 'not assigned'. null = your intentional 'no value'."},
      {q:"7 primitives?", a:"string, number, boolean, undefined, null, bigint, symbol."},
      {q:"Value vs reference?", a:"Primitives copy the value; objects copy the reference (shared)."},
      {q:"typeof null / typeof []?", a:"Both 'object'. null is the famous bug."},
      {q:"Temporal Dead Zone?", a:"let/const exist but are uninitialized until their line — early access → ReferenceError."}
    ]
  },

  /* ===================== LECTURE 03 ===================== */
  {
    id:"l3", num:"Lecture 03", title:"Operators & Comparisons", level:"int", time:"18 min",
    blurb:"Arithmetic, logical, ternary, strict vs loose equality, and the floating-point gotcha.",
    summary:[
      "Operators act on operands to form expressions; += *= etc. are shorthands.",
      "Modulo % tests even/odd; x++ uses the old value, ++x the new one.",
      "Always use === / !==; == coerces types and causes bugs.",
      "6 falsy values: false, 0, \"\", null, undefined, NaN — everything else is truthy.",
      "&& and || short-circuit; || is great for defaults, && for safe access.",
      "0.1 + 0.2 ≠ 0.3 because binary can't store those decimals exactly.",
      "For money, work in integer cents; for display use toFixed; for compare use Number.EPSILON."
    ],
    blocks:[
      {t:"prose", ic:"01", h:"Operators & operands", html:`
        <p class="lead">An operator works on values (operands) to form an expression that evaluates to one value.</p>
        <p>In <code>5 + 10</code>: <code>+</code> is the operator, <code>5</code> and <code>10</code> the operands, and the whole thing evaluates to <code>15</code>.</p>`},
      {t:"prose", ic:"02", h:"Arithmetic + assignment", html:`
        <p><code>+ - * / ** %</code>. Modulo <code>%</code> gives the remainder — perfect for even/odd (<code>n % 2 === 0</code>). <code>**</code> is exponentiation (<code>2 ** 8 = 256</code>). Compound assignment: <code>+= -= *= /= %= **=</code>.</p>
        <p><strong>Prefix vs postfix:</strong> <code>x++</code> evaluates to the <em>old</em> value then increments; <code>++x</code> increments first then evaluates to the <em>new</em> value.</p>`},
      {t:"playground", title:"increment.js", code:`let postfix = 5;
let prefix = 5;
console.log(postfix++); // 5  (then becomes 6)
console.log(postfix);   // 6
console.log(++prefix);  // 6  (incremented first)
console.log(10 % 3);    // 1  (remainder)
console.log(2 ** 8);    // 256`},
      {t:"prose", ic:"03", h:"=== vs == — the critical concept", html:`
        <p><strong>== (loose)</strong> compares after <em>type coercion</em> — confusing, avoid it. <strong>=== (strict)</strong> compares value <em>and</em> type with no coercion. Always prefer <code>===</code> and <code>!==</code>.</p>`},
      {t:"analogy", html:`<p><code>==</code> is a lazy bouncer who translates your ID and says "close enough." <code>===</code> is the strict scanner: both photo and name must match exactly. Use the strict one.</p>`},
      {t:"code", html:`console.<span class="fn">log</span>(<span class="num">7</span> == <span class="str">"7"</span>);    <span class="cmt">// true  (string coerced to number)</span>
console.<span class="fn">log</span>(<span class="num">0</span> == <span class="kw">false</span>);  <span class="cmt">// true  (false coerced to 0)</span>
console.<span class="fn">log</span>(<span class="num">7</span> === <span class="str">"7"</span>);   <span class="cmt">// false (number ≠ string)</span>
console.<span class="fn">log</span>(<span class="num">0</span> === <span class="kw">false</span>); <span class="cmt">// false (number ≠ boolean)</span>`},
      {t:"prose", ic:"04", h:"Logical operators & short-circuiting", html:`
        <p><code>&&</code> is true only if both sides are truthy; if the left is falsy the right is never evaluated (safe access: <code>user && user.name</code>). <code>||</code> is true if either side is truthy; if the left is truthy the right is skipped (defaults: <code>name || "Guest"</code>). <code>!</code> coerces to boolean then flips.</p>`},
      {t:"callout", k:"info", tag:"Truthy & Falsy", html:`<p>Exactly <strong>6 falsy values</strong>: <code>false</code>, <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else is truthy — including <code>"false"</code>, <code>[]</code>, and <code>{}</code>.</p>`},
      {t:"playground", title:"logical.js", code:`let username = "";  // falsy
let displayName = username || "Guest";
console.log(displayName);     // "Guest"

let user = null;
console.log(user && user.name); // null (stops safely)

console.log(Boolean([]));  // true  (empty array is truthy!)
console.log(Boolean(0));   // false`},
      {t:"prose", ic:"05", h:"Ternary & precedence", html:`
        <p>Ternary <code>condition ? ifTrue : ifFalse</code> is a compact if/else. Precedence: <code>*</code> beats <code>+</code>, so <code>2 + 3 * 5 = 17</code>. Don't memorize tables — use parentheses for clarity.</p>`},
      {t:"prose", ic:"06", h:"Why 0.1 + 0.2 ≠ 0.3", html:`
        <p>Computers think in <strong>base-2</strong> but we hand them base-10. Numbers like 0.1, 0.2, 0.3 have <strong>infinitely repeating</strong> binary forms, so 64-bit storage rounds them. The rounding errors don't cancel, giving <code>0.30000000000000004</code>. This is IEEE 754, not a JS bug — every language does it.</p>`},
      {t:"callout", k:"warn", tag:"How to handle it", html:`<p><strong>Money:</strong> work in integer cents. <strong>Display:</strong> <code>.toFixed(2)</code>. <strong>Compare:</strong> <code>Math.abs(a-b) < Number.EPSILON</code>.</p>`},
      {t:"playground", title:"float-trap.js", code:`console.log(0.1 + 0.2);          // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);  // false
console.log((0.1 + 0.2).toFixed(2)); // "0.30"
console.log(Math.abs((0.1+0.2)-0.3) < Number.EPSILON); // true`}
    ],
    interview:[
      {lvl:"beg", q:"What are operands?", a:"The values an operator works on. In 5 + 10, operands are 5 and 10."},
      {lvl:"beg", q:"What does % do?", a:"Returns the remainder. n % 2 === 0 checks even."},
      {lvl:"beg", q:"Which equality should you prefer and why?", a:"=== — it checks value and type with no coercion, avoiding == bugs."},
      {lvl:"beg", q:"List the 6 falsy values.", a:"false, 0, \"\", null, undefined, NaN."},
      {lvl:"beg", q:"Ternary syntax?", a:"condition ? valueIfTrue : valueIfFalse — the only 3-operand operator."},
      {lvl:"int", q:"x++ vs ++x?", a:"Postfix returns the original value then increments; prefix increments first then returns the new value."},
      {lvl:"int", q:"What is short-circuiting with examples?", a:"&& stops at the first falsy (user && user.name); || stops at the first truthy (input || 'Guest')."},
      {lvl:"int", q:"Why is [] truthy but \"\" falsy?", a:"[] is an object and all objects are truthy; \"\" is one of the six falsy values."},
      {lvl:"adv", q:"Why is 0.1 + 0.2 !== 0.3?", a:"IEEE 754 binary floats can't represent these decimals exactly; rounding errors accumulate to 0.30000000000000004."},
      {lvl:"adv", q:"How do you reliably compare two floats?", a:"Compare the absolute difference to Number.EPSILON: Math.abs(a-b) < Number.EPSILON."}
    ],
    practice:[
      {lvl:"beg", q:"Expression that is true only when n is even.", a:"<code>n % 2 === 0</code>"},
      {lvl:"beg", q:"Ternary: status = 'pass' if score>=40 else 'fail'.", a:"<code>let status = score >= 40 ? 'pass' : 'fail';</code>"},
      {lvl:"med", q:"Predict: 0 == false, 0 === false, '' == 0.", a:"true, false, true (empty string coerces to 0)."},
      {lvl:"med", q:"Default 'Anonymous' for an empty username using ||.", a:"<code>let name = username || 'Anonymous';</code>"},
      {lvl:"hard", q:"Safely compare (0.1 + 0.2) to 0.3.", a:"<code>Math.abs((0.1+0.2) - 0.3) < Number.EPSILON</code> → true"}
    ],
    quiz:[
      {q:"Value of 2 + 3 * 5?", opts:["25","17","20","13"], ans:1, exp:"* has higher precedence than +."},
      {q:"0.1 + 0.2 === 0.3 returns…", opts:["true","false","NaN","error"], ans:1, exp:"Binary floats round 0.1/0.2/0.3; the sum is 0.30000000000000004."},
      {q:"Which is NOT falsy?", opts:["0",'""',"[]","NaN"], ans:2, exp:"[] is an object — truthy."},
      {q:"Output? let p=5; console.log(p++); console.log(p);", opts:["5 then 6","6 then 6","5 then 5","6 then 5"], ans:0, exp:"Postfix returns 5 then increments to 6."},
      {q:"7 == \"7\" evaluates to…", opts:["true","false","NaN","ReferenceError"], ans:0, exp:"== coerces the string to a number."},
      {q:"Which to prefer for equality?", opts:["==","===","=","!="], ans:1, exp:"=== checks type and value, no coercion."}
    ],
    flashcards:[
      {q:"=== vs ==?", a:"=== checks value AND type, no coercion (preferred). == coerces (avoid)."},
      {q:"The 6 falsy values?", a:"false, 0, \"\", null, undefined, NaN. Everything else truthy."},
      {q:"x++ vs ++x?", a:"x++ returns old value then increments; ++x increments then returns new."},
      {q:"Why 0.1+0.2 ≠ 0.3?", a:"IEEE 754 binary can't store those decimals exactly → rounding errors."},
      {q:"|| for defaults?", a:"value || fallback returns fallback when value is falsy."},
      {q:"Compare floats safely?", a:"Math.abs(a-b) < Number.EPSILON."}
    ]
  },

  /* ===================== LECTURE 04 ===================== */
  {
    id:"l4", num:"Lecture 04", title:"Loops, Math & Strings", level:"int", time:"20 min",
    blurb:"if/else, for/while/do-while, the Math object, and essential String methods.",
    summary:[
      "if / else if / else runs top-to-bottom; the first true block wins.",
      "for = known counts; while = condition-based; do…while runs at least once.",
      "Forgetting to update a while condition → infinite loop and crash.",
      "All JS numbers are 64-bit IEEE-754 doubles; specials Infinity and NaN (NaN !== NaN).",
      "Use Number.isNaN (not global isNaN); Math for rounding & randomness.",
      "Random int: Math.floor(Math.random() * (max-min+1)) + min.",
      "Strings are immutable, zero-indexed; methods return new strings.",
      "Template literals: ${interpolation} + multi-line, replacing + concatenation."
    ],
    blocks:[
      {t:"prose", ic:"01", h:"if / else if / else", html:`
        <p class="lead">Like deciding what to wear: raining? → raincoat. Sunny? → sunglasses. Neither? → sweater.</p>
        <p>An <code>if</code> runs its block when true; <code>else</code> is the fallback. A chain evaluates <strong>top to bottom</strong> — the first true condition runs, the rest is skipped.</p>`},
      {t:"playground", title:"grade.js", code:`let score = 85;
let grade;
if (score >= 90)      grade = 'A';
else if (score >= 80) grade = 'B';
else if (score >= 70) grade = 'C';
else if (score >= 60) grade = 'D';
else                  grade = 'F';
console.log("Your grade is:", grade); // B`},
      {t:"prose", ic:"02", h:"for — known counts", html:`
        <p>Three parts: <strong>init</strong> (once), <strong>condition</strong> (before each pass), <strong>update</strong> (after each pass).</p>`},
      {t:"diagram", title:"for loop anatomy", html:`
        <div class="flow">
          <div class="node">① init: let i=1</div><span class="arr">→</span>
          <div class="node inv">② check: i≤5?</div><span class="arr">→</span>
          <div class="node">③ run body</div><span class="arr">→</span>
          <div class="node">④ update: i++</div>
        </div>
        <p class="muted" style="text-align:center;margin-top:10px">④ → ② → ③ → ④ until the condition is false</p>`},
      {t:"playground", title:"for.js", code:`for (let i = 1; i <= 5; i++) {
  console.log("Repetition:", i);
}
// stops when i becomes 6 (6 <= 5 is false)`},
      {t:"prose", ic:"03", h:"while & do…while", html:`
        <p><strong>while</strong> loops as long as a condition is true — update the variable inside or you get an infinite loop. <strong>do…while</strong> checks <em>after</em> the body, so it runs at least once (great for input validation).</p>`},
      {t:"callout", k:"warn", tag:"Infinite loop danger", html:`<p>Forget to change the condition variable inside a <code>while</code> (e.g. <code>hp -= 3</code>) and it runs forever, crashing the program.</p>`},
      {t:"playground", title:"while.js", code:`let hp = 10;
while (hp > 0) {
  console.log("HP " + hp + " - attacking!");
  hp -= 3; // MUST change the variable
}
console.log("Defeated!");`},
      {t:"prose", ic:"04", h:"Numbers & special values", html:`
        <p>One <code>number</code> type, stored as <strong>64-bit IEEE-754 doubles</strong>. Specials: <code>Infinity</code> / <code>-Infinity</code> (e.g. <code>1/0</code>) and <code>NaN</code> (invalid math). Quirk: <code>NaN === NaN</code> is <strong>false</strong> — use <code>Number.isNaN()</code>, not the coercing global <code>isNaN()</code>.</p>`},
      {t:"playground", title:"numbers.js", code:`console.log(1 / 0);            // Infinity
console.log("hello" / 2);     // NaN
console.log(NaN === NaN);     // false
console.log(isNaN("blue"));        // true  (coerces — misleading)
console.log(Number.isNaN("blue")); // false (reliable)
console.log((19.991234).toFixed(2)); // "19.99"
console.log((255).toString(16));     // "ff"`},
      {t:"prose", ic:"05", h:"Math & random integers", html:`
        <p><code>Math</code> is used directly. Rounding: <code>round</code>, <code>floor</code> (down), <code>ceil</code> (up), <code>trunc</code>. <code>Math.random()</code> returns <strong>[0, 1)</strong> — can be 0, never 1.</p>
        <p>Random int formula, built up: scale by <code>(max-min+1)</code>, <code>floor</code>, then add <code>min</code>.</p>`},
      {t:"playground", title:"random.js", code:`function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("Dice (1-6):", getRandomInt(1, 6));
console.log("floor 4.7:", Math.floor(4.7)); // 4
console.log("ceil 4.2:", Math.ceil(4.2));   // 5
console.log("max:", Math.max(10, -5, 100));  // 100`},
      {t:"prose", ic:"06", h:"Strings — immutable & indexed", html:`
        <p>Strings are primitive, <strong>immutable</strong> (methods return new strings), and <strong>zero-indexed</strong>. Last char: <code>str[str.length-1]</code>. Key methods: <code>toUpperCase</code>, <code>indexOf</code>, <code>includes</code>, <code>slice</code> (allows negatives), <code>replace</code>/<code>replaceAll</code>, <code>trim</code>, <code>split</code>.</p>`},
      {t:"playground", title:"strings.js", code:`let name = "alex";
name[0] = "A";        // fails silently
console.log(name);    // "alex" (unchanged)
console.log(name.toUpperCase()); // "ALEX" (new string)

let s = "The quick brown fox";
console.log(s.indexOf("fox"));   // 16
console.log(s.includes("quick"));// true
console.log(s.slice(4, 9));      // "quick"
console.log(s.slice(-3));        // "fox"
console.log("a,b,c".split(","))  // ["a","b","c"]`},
      {t:"prose", ic:"07", h:"Template literals (ES6)", html:`
        <p>Backtick strings allow <strong>interpolation</strong> with <code>\${…}</code> and <strong>multi-line</strong> text — cleaner than <code>+</code> concatenation.</p>`},
      {t:"playground", title:"template.js", code:`let user = "Alice";
let age = 30;
console.log(\`Hi, I'm \${user} and I am \${age}.\`);
console.log(\`Next year I'll be \${age + 1}.\`);
console.log(\`Multi
line
string\`);`}
    ],
    interview:[
      {lvl:"beg", q:"In an if/else-if/else chain, how many blocks run?", a:"Exactly one — the first true condition; the rest is skipped."},
      {lvl:"beg", q:"for vs while?", a:"for when you know the count; while when condition-based and the count is unknown."},
      {lvl:"beg", q:"What's special about do…while?", a:"It checks the condition after the body, so it always runs at least once."},
      {lvl:"beg", q:"What type are all JS numbers?", a:"A single 64-bit IEEE-754 double, for ints and decimals."},
      {lvl:"beg", q:"Are strings mutable?", a:"No — methods return new strings; the original is unchanged."},
      {lvl:"int", q:"What causes an infinite loop and how to avoid it?", a:"Not updating the condition variable inside the loop; ensure each pass moves toward making the condition false."},
      {lvl:"int", q:"Why is NaN === NaN false, and how to test for NaN?", a:"NaN is the only value not equal to itself; use Number.isNaN(x)."},
      {lvl:"int", q:"slice vs substring?", a:"Both extract a section; slice accepts negative indices, substring does not."},
      {lvl:"int", q:"Math.random() range and why floor + offset?", a:"[0, 1). Scale by (max-min+1), floor for integers, add min to shift to [min, max]."},
      {lvl:"adv", q:"How would you reverse a string?", a:"str.split('').reverse().join(''); for Unicode use [...str].reverse().join('')."},
      {lvl:"adv", q:"Math.floor vs ceil vs round for 4.5?", a:"floor → 4, ceil → 5, round → 5 (.5 rounds up)."}
    ],
    practice:[
      {lvl:"beg", q:"for loop printing 1 through 5.", a:"<code>for (let i=1; i<=5; i++) { console.log(i); }</code>"},
      {lvl:"beg", q:"Get the last character of string s.", a:"<code>s[s.length - 1]</code>"},
      {lvl:"med", q:"getRandomInt(min, max) inclusive.", a:"<code>Math.floor(Math.random()*(max-min+1))+min</code>"},
      {lvl:"med", q:"Extract 'World' from 'Hello World'.", a:"<code>s.slice(6)</code> or <code>s.slice(-5)</code> or <code>s.split(' ')[1]</code>"},
      {lvl:"hard", q:"Format 19.991234 to 2-decimal currency and 255 to hex.", a:"<code>(19.991234).toFixed(2)</code> → \"19.99\"; <code>(255).toString(16)</code> → \"ff\"."}
    ],
    quiz:[
      {q:"How many blocks run in an if/else-if/else chain?", opts:["All true ones","Exactly one (first true)","Only the else","None"], ans:1, exp:"First true condition runs; rest skipped."},
      {q:"NaN === NaN returns…", opts:["true","false","NaN","undefined"], ans:1, exp:"NaN is the only value not equal to itself."},
      {q:"Math.random() range?", opts:["[0,1]","(0,1)","[0,1)","[1,10]"], ans:2, exp:"0 inclusive, 1 exclusive."},
      {q:"Which loop runs at least once?", opts:["for","while","do…while","none"], ans:2, exp:"do…while checks the condition after the body."},
      {q:"Which reliably checks for NaN?", opts:["isNaN()","Number.isNaN()","x === NaN","typeof"], ans:1, exp:"Number.isNaN doesn't coerce."},
      {q:'"a,b,c".split(",") returns…', opts:['"abc"','["a","b","c"]','["a,b,c"]',"3"], ans:1, exp:"split breaks the string into an array."}
    ],
    flashcards:[
      {q:"for vs while vs do…while?", a:"for: known counts. while: condition-based. do…while: runs ≥1 time."},
      {q:"NaN quirk?", a:"NaN === NaN is false. Test with Number.isNaN(x)."},
      {q:"Math.random() range?", a:"[0, 1) — can be 0, never 1."},
      {q:"Random int formula?", a:"Math.floor(Math.random()*(max-min+1))+min"},
      {q:"Are strings mutable?", a:"No — methods return new strings."},
      {q:"Template literal powers?", a:"`${interpolation}` + multi-line strings."}
    ]
  },

  /* ===================== TYPE CONVERSION ===================== */
  {
    id:"tc", num:"Deep Dive", title:"Type Conversion & Coercion", level:"int", time:"14 min",
    blurb:"Number(), String(), Boolean(), implicit coercion traps, and comparison rules.",
    summary:[
      "Convert explicitly with Number(), String(), Boolean() — safe and readable.",
      "Number(null) → 0, Number(undefined) → NaN, Number(\"\") → 0.",
      "parseInt(\"100px\") → 100; Number(\"100px\") → NaN.",
      "Boolean(\"false\") is true — non-empty strings are always truthy.",
      "Boolean([]) and Boolean({}) are both true.",
      "\"5\" + 3 = \"53\"; \"5\" - 3 = 2 (+ concatenates with strings, - is always numeric)."
    ],
    blocks:[
      {t:"prose", ic:"01", h:"Implicit vs explicit", html:`
        <p class="lead">Two kinds of conversion.</p>
        <p><strong>Implicit (coercion)</strong> happens automatically — with <code>==</code> or mixed-type arithmetic — and causes bugs. <strong>Explicit</strong> is intentional: use the type's name as a function — <code>Number()</code>, <code>String()</code>, <code>Boolean()</code>.</p>`},
      {t:"analogy", html:`<p>Implicit coercion is a chef <em>secretly</em> swapping an ingredient. Explicit conversion is you <em>consciously</em> choosing the substitute — predictable and documented.</p>`},
      {t:"prose", ic:"02", h:"To Number", html:`
        <ul>
          <li><code>Number("123")</code> → 123; <code>Number("  123  ")</code> → 123 (trims).</li>
          <li><code>Number("")</code> → 0; <code>Number(null)</code> → 0 (surprise!); <code>Number(undefined)</code> → NaN.</li>
          <li><code>Number(true)</code> → 1; <code>Number("hello")</code> → NaN; <code>Number("100px")</code> → NaN.</li>
          <li><code>parseInt("100px")</code> → 100 (stops at non-digit); <code>parseFloat("3.14em")</code> → 3.14.</li>
          <li>Unary plus: <code>+"50"</code> → 50.</li>
        </ul>`},
      {t:"callout", k:"info", tag:"parseInt note", html:`<p>Modern JS treats <code>parseInt("010")</code> as <strong>10</strong> (decimal), not octal — the old octal behavior is gone since ES5. Passing a radix (<code>parseInt("010", 10)</code>) is still good defensive habit, especially for legacy environments.</p>`},
      {t:"playground", title:"to-number.js", code:`console.log(Number("  100  ")); // 100
console.log(Number(""));         // 0
console.log(Number(null));       // 0  (surprise)
console.log(Number(undefined));  // NaN
console.log(parseInt("100px"));  // 100
console.log(Number("100px"));    // NaN
console.log(+"50");              // 50`},
      {t:"prose", ic:"03", h:"To String", html:`
        <p><code>String()</code> works on anything: <code>String(null)</code> → "null", <code>String([1,2])</code> → "1,2". Also <code>(255).toString(16)</code> → "ff", <code>(19.991).toFixed(2)</code> → "19.99".</p>`},
      {t:"callout", k:"warn", tag:"The + gotcha", html:`<p><code>"5" + 3</code> → <code>"53"</code> (concatenation). <code>"5" - 3</code> → <code>2</code> (coerced to number; minus can't concatenate).</p>`},
      {t:"prose", ic:"04", h:"To Boolean", html:`
        <p><code>Boolean(x)</code> is false only for the 6 falsy values, true otherwise. Traps: <code>Boolean("false")</code> → true (non-empty string!), <code>Boolean([])</code> and <code>Boolean({})</code> → true. Shorthand: <code>!!x</code>.</p>`},
      {t:"playground", title:"to-boolean.js", code:`console.log(Boolean(""));      // false
console.log(Boolean("false")); // true (non-empty string!)
console.log(Boolean([]));      // true (object)
console.log(Boolean({}));      // true (object)
console.log("5" + 3);          // "53" concatenation
console.log("5" - 3);          // 2   numeric
console.log(!!"hello");        // true
console.log(!!0);              // false`}
    ],
    interview:[
      {lvl:"beg", q:"Number(null) and Number(undefined)?", a:"Number(null) → 0; Number(undefined) → NaN."},
      {lvl:"beg", q:"What is Boolean('false')?", a:"true — 'false' is a non-empty string; only \"\" is a falsy string."},
      {lvl:"int", q:"Predict \"5\" + 3, \"5\" - 3, +\"5\" + 3.", a:"\"53\" (concat), 2 (numeric), 8 (unary + makes 5, then 5+3)."},
      {lvl:"int", q:"parseInt('100px') vs Number('100px')?", a:"parseInt → 100 (stops at non-digit); Number → NaN (whole string must be valid)."},
      {lvl:"adv", q:"Why is null >= 0 true but null == 0 false?", a:"Relational converts null to 0 (0>=0 true); == only matches null with undefined and does no numeric conversion, so null == 0 is false."}
    ],
    practice:[
      {lvl:"beg", q:"Number(null) and Number(undefined)?", a:"0 and NaN."},
      {lvl:"beg", q:"Why is Boolean('false') true?", a:"It's a non-empty string; content doesn't matter for truthiness."},
      {lvl:"med", q:"Predict '5'+3, '5'-3, +'5'+3.", a:"'53', 2, 8."},
      {lvl:"hard", q:"Explain null >= 0 true, null > 0 false, null == 0 false.", a:"Relational: null→0, so 0>=0 true but 0>0 false. == only equates null with undefined, no coercion, so false."}
    ],
    quiz:[
      {q:"Number('') returns…", opts:["NaN","0","undefined","Error"], ans:1, exp:"Empty string → 0; only undefined and non-numeric strings give NaN."},
      {q:"Boolean([]) returns…", opts:["false","true","undefined","TypeError"], ans:1, exp:"Empty arrays are objects — truthy."},
      {q:"Result of '5' + 3?", opts:["8","53",'"53"',"NaN"], ans:2, exp:"+ with a string concatenates → '53'."},
      {q:"parseInt('3.9em') returns…", opts:["NaN","3","3.9","4"], ans:1, exp:"parseInt stops at the first non-integer char."},
      {q:"Boolean('false') is…", opts:["false","true","undefined","depends"], ans:1, exp:"Non-empty string is truthy regardless of content."}
    ],
    flashcards:[
      {q:"Number(null) / Number(undefined)?", a:"0 / NaN."},
      {q:"Boolean('false')?", a:"true — non-empty strings are truthy."},
      {q:"'5' + 3 vs '5' - 3?", a:"'53' (concat) vs 2 (numeric)."},
      {q:"parseInt('100px')?", a:"100 — stops at 'p'. Number('100px') is NaN."},
      {q:"Boolean([]) / Boolean({})?", a:"Both true — they're objects."}
    ]
  }

  ]
};

/* ===================== CODE CHALLENGES ===================== */
const CHALLENGES = [
  { id:"c1", title:"Hello, Variable!", diff:"Easy", xp:30, topic:"Basics",
    problem:"Declare a <code>const greeting</code> = \"Hello, World!\" and log it. Then a <code>let year</code> = 2025 and log it.",
    starter:`// 1. const greeting\n// 2. log it\n// 3. let year\n// 4. log it\n`,
    hints:["const for fixed values","console.log() prints","Current year is 2025"],
    solution:`const greeting = "Hello, World!";\nconsole.log(greeting);\nlet year = 2025;\nconsole.log(year);`,
    explanation:"const for values that won't change, let for those that might. const is the default."},
  { id:"c2", title:"Type Detective", diff:"Easy", xp:30, topic:"Types",
    problem:"Predict what <code>typeof</code> returns for each value, then run to verify.",
    starter:`console.log(typeof 42);\nconsole.log(typeof "hello");\nconsole.log(typeof true);\nconsole.log(typeof null);\nconsole.log(typeof undefined);\nconsole.log(typeof {});\nconsole.log(typeof []);\nconsole.log(typeof function(){});`,
    hints:["typeof null is the surprise","arrays & objects share a result","functions are special"],
    solution:`console.log(typeof 42);          // "number"\nconsole.log(typeof "hello");     // "string"\nconsole.log(typeof true);        // "boolean"\nconsole.log(typeof null);        // "object"  <- bug\nconsole.log(typeof undefined);   // "undefined"\nconsole.log(typeof {});          // "object"\nconsole.log(typeof []);          // "object"\nconsole.log(typeof function(){});// "function"`,
    explanation:"typeof null === 'object' is a historic bug. Arrays are objects. Functions get 'function'."},
  { id:"c3", title:"FizzBuzz", diff:"Medium", xp:50, topic:"Loops",
    problem:"Print 1–30. Multiples of 3 → \"Fizz\", of 5 → \"Buzz\", of both → \"FizzBuzz\".",
    starter:`for (let i = 1; i <= 30; i++) {\n  // your code\n}`,
    hints:["Check both (15) FIRST","n % 3 === 0 means divisible by 3","Use if / else if / else"],
    solution:`for (let i = 1; i <= 30; i++) {\n  if (i % 3 === 0 && i % 5 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}`,
    explanation:"Order matters — check the 'both' case first, or 15 prints 'Fizz' instead of 'FizzBuzz'."},
  { id:"c4", title:"String Reverser", diff:"Medium", xp:50, topic:"Strings",
    problem:"Reverse \"JavaScript\" → \"tpircSavaJ\".",
    starter:`const original = "JavaScript";\nconst reversed = /* your code */;\nconsole.log(reversed);`,
    hints:[".split('') → array of chars",".reverse() reverses an array",".join('') merges back"],
    solution:`const original = "JavaScript";\nconst reversed = original.split("").reverse().join("");\nconsole.log(reversed); // "tpircSavaJ"`,
    explanation:"split → reverse → join is the classic reversal. For emojis use [...str] instead of split('')."},
  { id:"c5", title:"Dice Roller", diff:"Medium", xp:50, topic:"Math",
    problem:"Write <code>rollDice(sides)</code> returning a random int 1..sides. Call for d6 and d20.",
    starter:`function rollDice(sides) {\n  // return random int 1..sides\n}\nconsole.log("d6:", rollDice(6));\nconsole.log("d20:", rollDice(20));`,
    hints:["Math.random() is [0,1)","multiply by sides","Math.floor then + 1"],
    solution:`function rollDice(sides) {\n  return Math.floor(Math.random() * sides) + 1;\n}\nconsole.log("d6:", rollDice(6));\nconsole.log("d20:", rollDice(20));`,
    explanation:"floor(random()*sides)+1 maps [0,1) to integers 1..sides."},
  { id:"c6", title:"Grade Calculator", diff:"Medium", xp:50, topic:"Operators",
    problem:"<code>getGrade(score)</code>: A 90+, B 80–89, C 70–79, D 60–69, F below.",
    starter:`function getGrade(score) {\n  // if / else if chain\n}\nconsole.log(getGrade(95), getGrade(82), getGrade(71), getGrade(65), getGrade(45));`,
    hints:["Check highest first","Use >= thresholds","else catches below 60"],
    solution:`function getGrade(score) {\n  if (score >= 90) return "A";\n  else if (score >= 80) return "B";\n  else if (score >= 70) return "C";\n  else if (score >= 60) return "D";\n  else return "F";\n}\nconsole.log(getGrade(95), getGrade(82), getGrade(71), getGrade(65), getGrade(45));`,
    explanation:"Top-to-bottom with >= means 95 hits >=90 first and returns 'A' immediately."},
  { id:"c7", title:"Palindrome Checker", diff:"Hard", xp:80, topic:"Strings",
    problem:"<code>isPalindrome(str)</code> — same forwards/backwards, case-insensitive, ignore non-alphanumerics.",
    starter:`function isPalindrome(str) {\n  // clean, then compare to reverse\n}\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("A man a plan a canal Panama"));\nconsole.log(isPalindrome("hello"));`,
    hints:[".toLowerCase() first","strip with .replace(/[^a-z0-9]/g,'')","compare to split-reverse-join"],
    solution:`function isPalindrome(str) {\n  const c = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return c === c.split("").reverse().join("");\n}\nconsole.log(isPalindrome("racecar"));                     // true\nconsole.log(isPalindrome("A man a plan a canal Panama")); // true\nconsole.log(isPalindrome("hello"));                       // false`,
    explanation:"Normalize (lowercase + strip), then compare to its reverse."},
  { id:"c8", title:"Sum of Digits", diff:"Hard", xp:80, topic:"Loops",
    problem:"<code>sumDigits(n)</code> — sum the digits. 1234 → 10. Works for negatives.",
    starter:`function sumDigits(n) {\n  // Math.abs, String, loop\n}\nconsole.log(sumDigits(1234), sumDigits(9999), sumDigits(-456));`,
    hints:["Math.abs(n) handles negatives","String(n) to get digits","Number(char) per digit"],
    solution:`function sumDigits(n) {\n  let sum = 0;\n  for (const d of String(Math.abs(n))) sum += Number(d);\n  return sum;\n}\nconsole.log(sumDigits(1234), sumDigits(9999), sumDigits(-456)); // 10 36 15`,
    explanation:"Convert to string, add each digit as a number; Math.abs removes the sign."}
];

/* ===================== ACHIEVEMENTS ===================== */
const ACHIEVEMENTS = [
  {id:"first",   em:"✦", t:"First Steps",      d:"Complete your first lesson.",     test:s=>s.completed.length>=1},
  {id:"half",    em:"◐", t:"Halfway",          d:"Complete half the lessons.",      test:s=>s.completed.length>=Math.ceil(COURSE.lessons.length/2)},
  {id:"finish",  em:"●", t:"Course Conqueror", d:"Complete every lesson.",          test:s=>s.completed.length>=COURSE.lessons.length},
  {id:"explorer",em:"◇", t:"Explorer",         d:"Open every lesson once.",         test:s=>s.visited.length>=COURSE.lessons.length},
  {id:"quiz",    em:"◆", t:"Quiz Master",      d:"Score 100% on any quiz.",         test:s=>Object.values(s.quizPerfect).some(Boolean)},
  {id:"allquiz", em:"▣", t:"Quiz Warrior",     d:"Attempt every quiz.",             test:s=>Object.keys(s.quizScore).length>=COURSE.lessons.length},
  {id:"xp200",   em:"△", t:"XP Collector",     d:"Earn 200 XP.",                    test:s=>s.xp>=200},
  {id:"xp500",   em:"▲", t:"Diamond Coder",    d:"Earn 500 XP.",                    test:s=>s.xp>=500},
  {id:"ch1",     em:"◈", t:"Problem Solver",   d:"Solve your first challenge.",     test:s=>s.challenges.length>=1},
  {id:"chall",   em:"✸", t:"JavaScript Hero",  d:"Solve all 8 challenges.",         test:s=>s.challenges.length>=CHALLENGES.length},
  {id:"flip",    em:"❖", t:"Card Flipper",     d:"Flip 10 flashcards.",             test:s=>s.flips>=10},
  {id:"note",    em:"✎", t:"Note Taker",       d:"Save a note.",                    test:s=>s.notedOnce},
  {id:"tracer",  em:"⊹", t:"Code Tracer",      d:"Use the execution tracer.",       test:s=>s.usedTracer}
];

/* ===================== TRACER EXAMPLES ===================== */
const TRACE_EXAMPLES = {
  vars: `let x = 10;\nlet y = 5;\nlet sum = x + y;\nlet diff = x - y;\nlet isPositive = sum > 0;\nlet result = isPositive ? "positive" : "negative";`,
  reassign: `let total = 0;\nlet i = 1;\ntotal = total + i;\ni = i + 1;\ntotal = total + i;\ni = i + 1;\ntotal = total + i;`,
  types: `let numStr = "42";\nlet asNumber = Number(numStr);\nlet backToStr = String(asNumber);\nlet boolTrue = Boolean(asNumber);\nlet weirdAdd = "5" + 3;\nlet weirdSub = "5" - 3;`
};
