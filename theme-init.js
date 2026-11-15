// Erscheinungsbild vor dem ersten Paint setzen, um Flackern zu vermeiden (externe Datei wegen Content Security Policy).
// Die App legt das berechnete Ergebnis für Hell und Dunkel unter "devatlas:appearance" ab (src/lib/appearance.ts).
try {
  var root = document.documentElement;
  var cache = JSON.parse(localStorage.getItem('devatlas:appearance') || 'null');
  if (cache && cache.light && cache.dark) {
    var dark = cache.mode === 'dark' || cache.mode === 'oled' || (cache.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var r = dark ? cache.dark : cache.light;
    var managed = ['dark', 'oled', 'hc', 'reduce-motion', 'motion-full', 'reading-focus'];
    for (var i = 0; i < managed.length; i++) root.classList.toggle(managed[i], r.classes.indexOf(managed[i]) >= 0);
    for (var k in r.vars) if (/^--[a-z0-9-]+$/.test(k) && typeof r.vars[k] === 'string') root.style.setProperty(k, r.vars[k]);
  } else {
    // Stand vor Version 1.2: nur Hell/Dunkel; ohne Angabe dem System folgen
    var t = localStorage.getItem('devatlas:theme');
    var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'light' || (!t && !sysDark)) root.classList.remove('dark');
  }
} catch (e) {
  /* Speicher nicht verfügbar */
}
