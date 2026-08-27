/* Mądre Dzieciaki — zakładki dokumentów i przełącznik języka.
   Każda wersja językowa strony to osobny statyczny plik, więc przełącznik
   nie przełącza treści w miejscu, tylko przenosi na adres z <option value>. */
(function () {
  'use strict';

  /* Przełącznik języka — <div class="lang-switch"><select> w nagłówku. Kotwica
     zakładki (#deletion itd.) jest wspólna dla wszystkich wersji, więc
     zabieramy ją ze sobą i rodzic ląduje w tej samej sekcji. */
  var langSelect = document.querySelector('.lang-switch select');
  if (langSelect) {
    langSelect.addEventListener('change', function () {
      window.location.href = langSelect.value + window.location.hash;
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
