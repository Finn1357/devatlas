import{r as n,j as e}from"./react-BfaOU4vi.js";import{c as F,u as B,P as H,e as I,d as K,q as k}from"./index-CSeM4TKT.js";import{a as Y}from"./core-B5XOlJRJ.js";import{C as O}from"./Callout-1nifdN8u.js";import{C as A,L as $}from"./CodeEditor-3CVmII_L.js";import{B as q,P as _}from"./PageTools-LujaXVFD.js";import{P as V}from"./prism-4lcCHyBI.js";import{R as Q}from"./rotate-ccw-K4lwXqwo.js";import{T as X}from"./trash-2-ydoA7gLf.js";import"./capacitor-CiGIljSf.js";import"./scroll-text-bnsGegDI.js";import"./chevron-right-B3wkRIe_.js";import"./check-BgqcZ8bC.js";import"./prism-A2v5VugZ.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],Z=F("square",ee);function G({lines:f,onClear:l}){const m=n.useRef(null);return n.useEffect(()=>{var o;(o=m.current)==null||o.scrollIntoView({block:"nearest"})},[f]),e.jsxs("div",{className:"flex min-h-[200px] flex-col overflow-hidden rounded-xl border bg-code",style:{borderColor:"var(--code-border)"},children:[e.jsxs("div",{className:"flex items-center justify-between border-b px-3 py-1.5 text-[11px] text-subtle",style:{borderColor:"var(--code-border)"},children:[e.jsx("span",{className:"font-medium",children:"Konsole"}),e.jsxs("button",{type:"button",onClick:l,className:"flex items-center gap-1 hover:text-fg",children:[e.jsx(X,{size:12})," Leeren"]})]}),e.jsxs("div",{className:"max-h-[420px] flex-1 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed",role:"log","aria-live":"polite",children:[f.length===0&&e.jsx("div",{className:"text-subtle",children:"Ausgaben von console.log erscheinen hier. Strg+Enter führt den Code aus."}),f.map((o,i)=>e.jsxs("div",{className:Y("whitespace-pre-wrap break-words border-b py-0.5 last:border-0",o.type==="error"?"text-danger":o.type==="warn"?"text-warning":o.type==="system"?"text-subtle italic":"text-[var(--code-fg)]"),style:{borderColor:"var(--code-border)"},children:[o.type==="error"?"✖ ":o.type==="warn"?"⚠ ":o.type==="system"?"":"› ",o.text]},i)),e.jsx("div",{ref:m})]})]})}const te=()=>new URL("workers/js-runner.js",document.baseURI).href,P={Grundlagen:`// Variablen, Funktionen, Template Literals
const name = 'Ada';
let zaehler = 0;

function begruesse(person, gruss = 'Hallo') {
  return \`\${gruss}, \${person}!\`;
}

for (let i = 0; i < 3; i++) zaehler += i;

console.log(begruesse(name));
console.log('Zähler:', zaehler);
console.log(typeof name, typeof zaehler, typeof null);`,"Array-Methoden":`const produkte = [
  { name: 'Tastatur', preis: 49.9, kategorie: 'Technik' },
  { name: 'Roman', preis: 14, kategorie: 'Buch' },
  { name: 'Maus', preis: 24.5, kategorie: 'Technik' },
];

const technik = produkte.filter((p) => p.kategorie === 'Technik');
const namen = technik.map((p) => p.name);
const summe = produkte.reduce((acc, p) => acc + p.preis, 0);
const nachKategorie = Object.groupBy(produkte, (p) => p.kategorie);

console.log(namen);
console.log('Summe:', summe.toFixed(2));
console.log(nachKategorie);`,"Async & Promises":`const warte = (ms, wert) => new Promise((res) => setTimeout(() => res(wert), ms));

console.log('Start');
const t0 = performance.now();

// nacheinander
const a = await warte(300, 'A');
const b = await warte(300, 'B');
console.log('sequenziell:', a, b, Math.round(performance.now() - t0), 'ms');

// parallel
const t1 = performance.now();
const [c, d] = await Promise.all([warte(300, 'C'), warte(300, 'D')]);
console.log('parallel:', c, d, Math.round(performance.now() - t1), 'ms');`,"Event-Loop-Reihenfolge":`console.log('1 synchron');
setTimeout(() => console.log('4 Macrotask (Timer)'), 0);
Promise.resolve().then(() => console.log('3 Microtask (Promise)'));
queueMicrotask(() => console.log('3b Microtask (queueMicrotask)'));
console.log('2 synchron');`,"Klassen & Closures":`class Konto {
  #saldo = 0;
  constructor(inhaber) { this.inhaber = inhaber; }
  einzahlen(betrag) {
    if (betrag <= 0) throw new RangeError('Betrag muss positiv sein');
    this.#saldo += betrag;
    return this;
  }
  get saldo() { return this.#saldo; }
}

const k = new Konto('Ada').einzahlen(50).einzahlen(25);
console.log(k.inhaber, k.saldo);

function zaehler() {
  let n = 0;
  return () => ++n;
}
const next = zaehler();
console.log(next(), next(), next());

try { k.einzahlen(-5); } catch (e) { console.error(e); }`},j={html:`<main class="karte">
  <h1>Klickzähler</h1>
  <p>Du hast <strong id="anzahl">0</strong>-mal geklickt.</p>
  <button id="plus" type="button">+1</button>
  <button id="reset" type="button">Zurücksetzen</button>
</main>`,css:`body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #e2e8f0; }
.karte { background: #1e293b; padding: 2rem; border-radius: 16px; text-align: center; box-shadow: 0 10px 30px #0006; }
button { font: inherit; padding: .5rem 1rem; margin: .25rem; border: 0; border-radius: 8px; background: #6366f1; color: white; cursor: pointer; }
button:hover { background: #818cf8; }
#reset { background: #334155; }`,js:`let anzahl = 0;
const ausgabe = document.querySelector('#anzahl');
document.querySelector('#plus').addEventListener('click', () => {
  anzahl++;
  ausgabe.textContent = anzahl;
  console.log('Klick Nr.', anzahl);
});
document.querySelector('#reset').addEventListener('click', () => {
  anzahl = 0;
  ausgabe.textContent = anzahl;
});`};function J(f,l,m){const o="<script>(function(){var send=function(t,a){try{parent.postMessage({__devatlas:true,type:t,text:Array.prototype.map.call(a,function(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}).join(' ')},'*')}catch(e){}};['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){send(k,arguments);o.apply(console,arguments)}});window.addEventListener('error',function(e){send('error',[e.message+' (Zeile '+e.lineno+')'])});window.addEventListener('unhandledrejection',function(e){send('error',['Unbehandelte Promise-Ablehnung: '+e.reason])});})();<\/script>",i=m.replace(/<\/script/gi,"<\\/script");return`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${o}<style>${l}</style></head><body>${f}<script>${i}<\/script></body></html>`}function ye(){const f=B(),[l,m]=n.useState("js"),[o,i]=n.useState(P.Grundlagen),[a,p]=n.useState(j),[c,y]=n.useState("html"),[S,z]=n.useState(()=>J(j.html,j.css,j.js)),[L,r]=n.useState(0),h=n.useRef(S);h.current=S;const[b,d]=n.useState([]),[w,v]=n.useState(!1),u=n.useRef(null),x=n.useRef(void 0),N=n.useRef(null);n.useEffect(()=>{if(f.query.get("import"))try{const t=sessionStorage.getItem("devatlas:lab-import");if(t){const{code:s,lang:g}=JSON.parse(t);g==="js"&&(i(s),m("js")),sessionStorage.removeItem("devatlas:lab-import")}}catch{}},[]),n.useEffect(()=>{const t=s=>{var g,T,W,D;if(!(s.source!==((g=N.current)==null?void 0:g.contentWindow)||!((T=s.data)!=null&&T.__devatlas))){if(s.data.type==="sandbox-ready"){(D=(W=N.current)==null?void 0:W.contentWindow)==null||D.postMessage({type:"render-html",html:h.current},"*");return}d(U=>[...U,{type:s.data.type,text:s.data.text}].slice(-500))}};return window.addEventListener("message",t),()=>{var s;window.removeEventListener("message",t),(s=u.current)==null||s.terminate()}},[]);const C=t=>{var s;(s=u.current)==null||s.terminate(),u.current=null,window.clearTimeout(x.current),v(!1),t&&d(g=>[...g,{type:"system",text:t}])},M=l==="js"?()=>{C(),d([{type:"system",text:`▶ Ausführung gestartet (${new Date().toLocaleTimeString("de-DE")})`}]);const t=new Worker(te());u.current=t,v(!0),t.onmessage=s=>{if(s.data.type==="done"){v(!1),window.clearTimeout(x.current),x.current=window.setTimeout(()=>C(),3e3);return}d(g=>[...g,{type:s.data.type,text:s.data.text??""}].slice(-500))},t.onerror=s=>d(g=>[...g,{type:"error",text:s.message}]),x.current=window.setTimeout(()=>C("⏱ Abgebrochen: Zeitlimit von 8 Sekunden erreicht (Endlosschleife?)."),8e3),t.postMessage(o)}:()=>{d([{type:"system",text:"▶ Seite neu geladen"}]),z(J(a.html,a.css,a.js)),r(t=>t+1)};return e.jsxs("div",{children:[e.jsx(q,{items:[{label:"Labor",to:"/labor"},{label:"Code-Playground"}]}),e.jsx(H,{eyebrow:"Labor",title:"JavaScript-, HTML- & CSS-Playground",description:"Schreibe Code und führe ihn direkt aus. JavaScript läuft isoliert in einem Web Worker (mit Zeitlimit), Webseiten in einem iframe mit Sandbox ohne Zugriff auf DevAtlas.",actions:e.jsx(_,{route:"/labor/playground",title:"Code-Playground",type:"Werkzeug"})}),e.jsxs("div",{className:"mb-4 flex flex-wrap items-center gap-3",children:[e.jsx(I,{tabs:[{id:"js",label:"JavaScript (Konsole)"},{id:"web",label:"HTML + CSS + JS (Vorschau)"}],value:l,onChange:t=>{m(t),d([])}}),l==="js"&&e.jsx("div",{className:"flex flex-wrap gap-1.5",children:Object.keys(P).map(t=>e.jsx(K,{onClick:()=>i(P[t]),children:t},t))})]}),e.jsxs("div",{className:"grid gap-4 xl:grid-cols-2",children:[e.jsxs("div",{children:[l==="js"?e.jsx(A,{value:o,onChange:i,lang:"javascript",onRun:M,minHeight:380,label:"JavaScript-Code"}):e.jsxs(e.Fragment,{children:[e.jsx(I,{className:"mb-2 w-fit",tabs:[{id:"html",label:"HTML"},{id:"css",label:"CSS"},{id:"js",label:"JavaScript"}],value:c,onChange:y}),e.jsx(A,{value:a[c],onChange:t=>p(s=>({...s,[c]:t})),lang:c==="html"?"markup":c==="css"?"css":"javascript",onRun:M,minHeight:340,label:`${c.toUpperCase()}-Code`},c)]}),e.jsxs("div",{className:"mt-3 flex flex-wrap gap-2",children:[e.jsxs(k,{variant:"primary",onClick:M,children:[w?e.jsx($,{size:15,className:"animate-spin"}):e.jsx(V,{size:15})," Ausführen ",e.jsx("span",{className:"hidden text-xs opacity-70 sm:inline",children:"(Strg+Enter)"})]}),l==="js"&&w&&e.jsxs(k,{variant:"danger",onClick:()=>C("■ Manuell gestoppt."),children:[e.jsx(Z,{size:14})," Stopp"]}),e.jsxs(k,{variant:"ghost",onClick:()=>l==="js"?i(P.Grundlagen):p(j),children:[e.jsx(Q,{size:14})," Zurücksetzen"]})]})]}),e.jsxs("div",{className:"space-y-4",children:[l==="web"&&e.jsx("div",{className:"overflow-hidden rounded-xl border border-line bg-white",children:e.jsx("iframe",{ref:N,title:"Vorschau",sandbox:"allow-scripts allow-modals",src:`sandbox.html?r=${L}`,className:"h-[340px] w-full"})}),e.jsx(G,{lines:b,onClear:()=>d([])})]})]}),e.jsx(O,{type:"info",className:"mt-6",title:"Grenzen der Ausführung",children:"Im JavaScript-Modus gibt es keinen DOM (Worker) – dafür den HTML-Modus nutzen. Netzwerkzugriffe aus der Sandbox funktionieren nur zu Servern, die CORS für beliebige Origins erlauben."})]})}const E="0.27.7",re=()=>new URL(`workers/python-runner.js?v=${E}`,document.baseURI).href,R={Grundlagen:`name = "Ada"
zahlen = [3, 1, 4, 1, 5, 9, 2, 6]

print(f"Hallo, {name}!")
print("Sortiert:", sorted(zahlen))
print("Quadrate gerader Zahlen:", [z * z for z in zahlen if z % 2 == 0])

alter = {"Ada": 36, "Linus": 28}
for person, jahre in alter.items():
    print(f"{person:<6} {jahre:>3} Jahre")`,"Klassen & Dataclasses":`from dataclasses import dataclass, field

@dataclass
class Konto:
    inhaber: str
    buchungen: list[float] = field(default_factory=list)

    def einzahlen(self, betrag: float) -> None:
        if betrag <= 0:
            raise ValueError("Betrag muss positiv sein")
        self.buchungen.append(betrag)

    @property
    def saldo(self) -> float:
        return sum(self.buchungen)

k = Konto("Ada")
k.einzahlen(50)
k.einzahlen(25.5)
print(k, "→ Saldo:", k.saldo)

try:
    k.einzahlen(-1)
except ValueError as e:
    print("Fehler:", e)`,Generatoren:`def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 15)))

summe = sum(x for x in range(1_000_000) if x % 7 == 0)
print("Summe der Vielfachen von 7 unter 1 Mio.:", summe)`,NumPy:`import numpy as np   # in DevAtlas enthalten – läuft auch offline

a = np.arange(1, 11)
print("Array:", a)
print("Mittelwert:", a.mean(), "Std.-Abw.:", round(a.std(), 3))
m = a.reshape(2, 5)
print("Matrix:\\n", m)
print("Transponiert × Matrix:\\n", m.T @ m)`};function we(){const f=B(),[l,m]=n.useState(R.Grundlagen),[o,i]=n.useState([]),[a,p]=n.useState("idle"),c=n.useRef(null),y=n.useRef(null);n.useEffect(()=>{if(f.query.get("import"))try{const r=sessionStorage.getItem("devatlas:lab-import");if(r){const{code:h,lang:b}=JSON.parse(r);b==="python"&&m(h),sessionStorage.removeItem("devatlas:lab-import")}}catch{}return()=>{var r;return(r=c.current)==null?void 0:r.terminate()}},[]);const S=()=>{var h;(h=c.current)==null||h.terminate();const r=new Worker(re(),{type:"module"});c.current=r,r.postMessage({type:"init",version:E}),p("loading"),i(b=>[...b,{type:"system",text:`Starte Python-Laufzeit (Pyodide ${E}) …`}]),r.onmessage=b=>{var v;const{type:d,text:w=""}=b.data;if(d==="ready"){if(p("ready"),i(u=>[...u,{type:"system",text:w}]),(v=navigator.serviceWorker)==null||v.ready.then(u=>{var x;return(x=u.active)==null?void 0:x.postMessage({type:"CACHE_PYODIDE"})}).catch(()=>{}),y.current){const u=y.current;y.current=null,p("running"),r.postMessage(u)}}else d==="fatal"?(p("error"),i(u=>[...u,{type:"error",text:`Die Python-Laufzeit konnte nicht gestartet werden: ${w}`}])):d==="done"?p("ready"):i(u=>[...u,{type:d,text:w}].slice(-500))},r.onerror=b=>{p("error"),i(d=>[...d,{type:"error",text:b.message||"Worker-Fehler"}])}},z=()=>{if(!(a==="running"||a==="loading")){if(i(r=>[...r.filter(h=>h.type==="system").slice(-2),{type:"system",text:"▶ Ausführung gestartet"}]),!c.current||a==="idle"||a==="error"){y.current=l,S();return}p("running"),c.current.postMessage(l)}},L=()=>{var r;(r=c.current)==null||r.terminate(),c.current=null,p("idle"),i(h=>[...h,{type:"system",text:"■ Gestoppt. Die Laufzeit wird beim nächsten Ausführen neu geladen."}])};return e.jsxs("div",{children:[e.jsx(q,{items:[{label:"Labor",to:"/labor"},{label:"Python im Browser"}]}),e.jsx(H,{eyebrow:"Labor",title:"Python im Browser",description:"Echtes CPython, kompiliert zu WebAssembly (Pyodide), läuft in einem Web Worker auf deinem Rechner. Die Laufzeit wird erst beim ersten Ausführen geladen.",actions:e.jsx(_,{route:"/labor/python",title:"Python im Browser",type:"Werkzeug"})}),e.jsx("div",{className:"mb-4 flex flex-wrap gap-1.5",children:Object.keys(R).map(r=>e.jsx(K,{onClick:()=>m(R[r]),children:r},r))}),e.jsxs("div",{className:"grid gap-4 xl:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(A,{value:l,onChange:m,lang:"python",onRun:z,minHeight:380,label:"Python-Code"}),e.jsxs("div",{className:"mt-3 flex flex-wrap items-center gap-2",children:[e.jsxs(k,{variant:"primary",onClick:z,disabled:a==="running"||a==="loading",children:[a==="loading"||a==="running"?e.jsx($,{size:15,className:"animate-spin"}):e.jsx(V,{size:15}),a==="loading"?"Lade Python …":a==="running"?"Läuft …":"Ausführen"]}),(a==="running"||a==="loading")&&e.jsxs(k,{variant:"danger",onClick:L,children:[e.jsx(Z,{size:14})," Stopp"]}),e.jsxs("span",{className:"text-xs text-subtle",children:["Status: ",{idle:"nicht geladen",loading:"lädt",ready:"bereit",running:"läuft",error:"Fehler"}[a]]})]})]}),e.jsx(G,{lines:o,onClear:()=>i([])})]}),e.jsx(O,{type:"info",className:"mt-6",title:"Hinweise",children:"`input()` ist im Browser nicht verfügbar. Python und die Standardbibliothek sind in DevAtlas enthalten und laufen offline (im Browser nach dem ersten Start des Labors). NumPy ist ebenfalls enthalten. Weitere Zusatzpakete wie pandas oder SciPy werden bei `import` automatisch aus dem Internet (cdn.jsdelivr.net) nachgeladen – dafür ist eine Verbindung nötig."})]})}export{ye as JsPlayground,we as PythonLab};
