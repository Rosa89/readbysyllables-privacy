/* Mądre Dzieciaki — zakładki dokumentów i przełącznik języka.
   Wybór języka trzymamy w localStorage, żeby przejście między stronami nie
   resetowało go rodzicowi w połowie czytania. */
(function () {
  'use strict';

  var KEY = 'madre-dzieciaki-lang';
  var root = document.documentElement;

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    try { localStorage.setItem(KEY, lang); } catch (e) { /* tryb prywatny */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* brak dostępu */ }
  if (saved === 'pl' || saved === 'en') applyLang(saved);

  var toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      applyLang(root.getAttribute('data-lang') === 'en' ? 'pl' : 'en');
    });
  }

  var nav = document.querySelector('.doc-nav');
  if (!nav) return;

  var buttons = Array.prototype.slice.call(nav.querySelectorAll('button[data-page]'));
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));

  function show(id, updateHash) {
    var target = document.getElementById(id);
    if (!target) return;

    pages.forEach(function (p) { p.classList.toggle('active', p === target); });
    buttons.forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-page') === id ? 'true' : 'false');
    });

    /* Kotwica w adresie pozwala linkować wprost do polityki — tego wymaga
       Google Play, które przyjmuje jeden konkretny URL. */
    if (updateHash && window.history && history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-page'), true); });
  });

  function openFromHash() {
    var id = window.location.hash.replace('#', '');
    if (id && document.getElementById(id)) show(id, false);
  }

  openFromHash();

  /* Zmiana samego fragmentu adresu nie przeładowuje strony, więc bez tego
     wklejony link z kotwicą (np. …/#deletion) nie otwierałby swojej zakładki. */
  window.addEventListener('hashchange', openFromHash);
})();
