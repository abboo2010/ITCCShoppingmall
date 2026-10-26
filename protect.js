/* Image protection: blocks right-click "Save image as", dragging images to the desktop,
   and the long-press save menu on phones. This is a deterrent only - it cannot stop
   screenshots or browser developer tools. */
(function () {
  var PROTECT = 'img, picture, svg, canvas, .plan-wrap, .lots, .lot, .lightbox, .hero-card';

  // Right-click / long-press menu on images and floor plans (including the hotspot layer above them)
  document.addEventListener('contextmenu', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest(PROTECT)) e.preventDefault();
  }, true);

  // Dragging an image out of the page
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || (t.closest && t.closest(PROTECT)))) e.preventDefault();
  }, true);

  // No drag ghost, no iOS/Android "save image" callout, no text/image selection highlight
  var style = document.createElement('style');
  style.textContent =
    'img,picture,svg,canvas{-webkit-user-drag:none;user-drag:none;-webkit-touch-callout:none;' +
    '-webkit-user-select:none;user-select:none}' +
    '.plan-wrap,.lots,.lot,.lightbox{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}';
  document.head.appendChild(style);

  // Mark every image non-draggable, including ones added later (store logos, lightbox image)
  function lock(img) { img.setAttribute('draggable', 'false'); }
  function lockAll(root) {
    if (root.tagName === 'IMG') lock(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('img'), lock);
  }
  lockAll(document);
  new MutationObserver(function (records) {
    records.forEach(function (r) {
      Array.prototype.forEach.call(r.addedNodes, function (n) { if (n.nodeType === 1) lockAll(n); });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
