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
      } else { logo.textContent = "[LOGO]"; }
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
  function showPlan(i, focus) {
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

  // enlarge a plan in a lightbox
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbClose = document.getElementById("lightboxClose");
  var lastZoom = null;
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastZoom) lastZoom.focus();
  }
  document.querySelectorAll(".plan-zoom").forEach(function (b) {
    b.addEventListener("click", function () {
      var img = b.querySelector("img");
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lastZoom = b;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lbClose.focus();
    });
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
