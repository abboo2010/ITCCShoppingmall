(function () {
  var STORES = window.ITCC_STORES || [];
  var EVENTS = window.ITCC_EVENTS || [];
  var HOURS = window.ITCC_HOURS || { open: 10, close: 22 };

  var state = { cat: "All", q: "" };
  var CATS = ["All", "Fashion", "Food", "Kids", "Services"];
  
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- open now (Malaysia time) ---------- */
  function renderOpenNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kuala_Lumpur", hour: "numeric", hour12: false
    }).formatToParts(new Date());
    var hour = 0;
    parts.forEach(function (p) { if (p.type === "hour") hour = parseInt(p.value, 10) % 24; });
    var isOpen = hour >= HOURS.open && hour < HOURS.close;
    var box = document.getElementById("openNow");
    box.textContent = "";
    var dot = el("span", "dot");
    dot.style.background = isOpen ? "#0f6b3f" : "#b3262e";
    box.appendChild(dot);
    box.appendChild(document.createTextNode(isOpen ? "Open now" : "Closed now"));
  }
  renderOpenNow();

  /* ---------- store directory ---------- */
  var filtersBox = document.getElementById("filters");
  var grid = document.getElementById("storeGrid");
  var count = document.getElementById("resultCount");

  function renderFilters() {
    filtersBox.textContent = "";
    CATS.forEach(function (c) {
      var b = el("button", null, c);
      b.type = "button";
      b.setAttribute("aria-pressed", state.cat === c ? "true" : "false");
      b.addEventListener("click", function () { state.cat = c; renderFilters(); renderStores(); });
      filtersBox.appendChild(b);
    });
  }

  function renderStores() {
    var q = state.q.trim().toLowerCase();
    var list = STORES.filter(function (s) {
      var catOk = state.cat === "All" || s.category === state.cat;
      var qOk = !q || (s.name + " " + s.category + " " + s.unit + " " + s.level).toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });
    grid.textContent = "";
    if (!list.length) {
      grid.appendChild(el("div", "empty", "No stores found. Try another search or category."));
    }
    list.forEach(function (s) {
      var card = el("article", "store");
      var logo = el("div", "logo-ph");
      if (s.logo) {
        var img = document.createElement("img");
        img.src = s.logo; img.alt = s.name + " logo"; img.loading = "lazy";
        logo.appendChild(img);
      } else {
        var ph = document.createElement("img");
        ph.src = "logo.png"; ph.alt = "ITCC Penampang Shopping Mall"; ph.loading = "lazy"; ph.className = "default-logo";
        logo.appendChild(ph);
      }
      card.appendChild(logo);
      card.appendChild(el("h3", null, s.name));
      var meta = el("div", "meta");
      meta.appendChild(el("span", null, s.category));
      meta.appendChild(el("span", null, s.level + " · " + s.unit));
      card.appendChild(meta);
      grid.appendChild(card);
    });
    count.textContent = list.length + (list.length === 1 ? " store" : " stores");
  }

  renderFilters();
  renderStores();

  // hero search -> filter directory and scroll to it
  document.getElementById("heroSearch").addEventListener("submit", function (e) {
    e.preventDefault();
    state.q = document.getElementById("heroQ").value;
    state.cat = "All";
    renderFilters(); renderStores();
    document.getElementById("stores").scrollIntoView({ behavior: "smooth" });
  });
  // hero chips -> category filter
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      state.cat = c.getAttribute("data-cat");
      state.q = "";
      document.getElementById("heroQ").value = "";
      renderFilters(); renderStores();
      document.getElementById("stores").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- events ---------- */
  var eventRow = document.getElementById("eventRow");
  EVENTS.forEach(function (ev) {
    var card = el("article", "event " + (ev.style || "white"));
    card.appendChild(el("div", "date", ev.date));
    card.appendChild(el("h3", null, ev.title));
    eventRow.appendChild(card);
  });

  /* ---------- floor plan tabs ---------- */
  var planTabs = Array.prototype.slice.call(document.querySelectorAll("#planTabs [role=tab]"));
  var planPanels = Array.prototype.slice.call(document.querySelectorAll(".plan-panel"));
  var activePlan = 0;
  function showPlan(i, focus) {
    activePlan = i;
    planTabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("aria-pressed", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      planPanels[k].hidden = !on;
    });
    if (focus) planTabs[i].focus();
  }
  planTabs.forEach(function (t, i) {
    t.addEventListener("click", function () { showPlan(i); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = (i + 1) % planTabs.length;
      if (e.key === "ArrowLeft") n = (i - 1 + planTabs.length) % planTabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = planTabs.length - 1;
      if (n !== null) { e.preventDefault(); showPlan(n, true); }
    });
  });
  showPlan(0);

  /* ---------- shop lots: 3D hover + tooltip ---------- */
  var PLAN = window.ITCC_PLAN || {};
  var SHOPS = window.ITCC_LOT_SHOPS || {};
  var FLOOR_NAMES = { g: "Ground Floor", "1": "First Floor", "2": "Second Floor", "3": "Third Floor" };
  var FLOOR_KEYS = ["g", "1", "2", "3"];

  function buildLots(layer, key) {
    layer.textContent = "";
    var f = PLAN[key];
    if (!f) return;
    f.lots.forEach(function (l) {
      var d = el("div", "lot");
      d.style.left = (l.x / f.w * 100) + "%";
      d.style.top = (l.y / f.h * 100) + "%";
      d.style.width = (l.w / f.w * 100) + "%";
      d.style.height = (l.h / f.h * 100) + "%";
      d.setAttribute("data-id", l.id);
      d.setAttribute("data-floor", key);
      layer.appendChild(d);
    });
  }
  document.querySelectorAll(".plan-wrap[data-floor]").forEach(function (w) {
    buildLots(w.querySelector(".lots"), w.getAttribute("data-floor"));
  });

  var tip = document.getElementById("lotTip");
  var tipLot = null;
  function showTip(lot) {
    var shop = SHOPS[lot.getAttribute("data-id")];
    tip.textContent = "";
    tip.appendChild(el("strong", null, shop ? shop.name : "Shop details coming soon"));
    tip.appendChild(el("span", "tip-floor", FLOOR_NAMES[lot.getAttribute("data-floor")] || ""));
    if (shop && shop.phone) tip.appendChild(el("span", "tip-phone", "Tel: " + shop.phone));
    tip.hidden = false;
    var r = lot.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var top = r.top - th - 12;
    if (top < 8) top = r.bottom + 12;
    var left = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
    tip.style.top = top + "px";
    tip.style.left = left + "px";
    tipLot = lot;
  }
  function hideTip() {
    tip.hidden = true;
    if (tipLot) {
      tipLot.classList.remove("is-active");
      tipLot.style.removeProperty("--rx");
      tipLot.style.removeProperty("--ry");
    }
    tipLot = null;
  }
  document.addEventListener("mouseover", function (e) {
    var l = e.target.closest && e.target.closest(".lot");
    if (l && l !== tipLot) { hideTip(); l.classList.add("is-active"); showTip(l); }
  });
  document.addEventListener("mouseout", function (e) {
    var l = e.target.closest && e.target.closest(".lot");
    if (l && !(e.relatedTarget && l.contains(e.relatedTarget))) hideTip();
  });
  document.addEventListener("mousemove", function (e) {
    var l = e.target.closest && e.target.closest(".lot");
    if (!l) return;
    var r = l.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    l.style.setProperty("--ry", (px * 16).toFixed(1) + "deg");
    l.style.setProperty("--rx", (-py * 16).toFixed(1) + "deg");
  });
  // touch screens: tap a lot to show it, tap elsewhere to hide
  document.addEventListener("click", function (e) {
    var l = e.target.closest && e.target.closest(".lot");
    if (l) { hideTip(); l.classList.add("is-active"); showTip(l); }
    else if (!e.target.closest("#lotTip")) hideTip();
  });
  window.addEventListener("scroll", hideTip, { passive: true });

  /* ---------- enlarge the current plan in a lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbLots = document.getElementById("lbLots");
  var lbClose = document.getElementById("lightboxClose");
  var enlargeBtn = document.getElementById("enlargeBtn");
  function closeLightbox() {
    hideTip();
    lb.hidden = true;
    document.body.style.overflow = "";
    enlargeBtn.focus();
  }
  enlargeBtn.addEventListener("click", function () {
    var key = FLOOR_KEYS[activePlan];
    var img = planPanels[activePlan].querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    buildLots(lbLots, key);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  });
  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });

  /* ---------- leasing form (front-end only for now) ---------- */
  var form = document.getElementById("leaseForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (inp) {
      var bad = !inp.value.trim() || (inp.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value));
      inp.setAttribute("aria-invalid", bad ? "true" : "false");
      inp.style.borderColor = bad ? "#b3262e" : "";
      if (bad) ok = false;
    });
    note.style.color = ok ? "#0f6b3f" : "#b3262e";
    note.textContent = ok
      ? "Thank you! (Demo only: the form is not connected yet. Supabase comes in step 3.)"
      : "Please fill in all fields correctly.";
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
