# ITCCMALL

ITCC Penampang Shopping Mall website (Style B, "Fresh & Vibrant"): store directory, dining, events, floor plans, visit/map and leasing enquiry.

- `index.html`, `styles.css`, `app.js` - the site
- `stores.js` - dummy stores/events/hours (replace with the real ITCC data)
- `lots.js` - auto-detected shop lot outlines on each floor plan (3D hover areas)
- `lot-shops.js` - DUMMY shop name + phone per lot id (replace with the real tenants)
- `tools/detect_lots.py` - regenerates `lots.js` from `images/` (re-run if plans change)
- `images/` - floor plans shown on the site (currently ChatGPT-enlarged; unit labels unverified)
- `images-faithful/` - sharpened versions that keep the original labels
- `originals/` - original screenshots
- `floor-plans-standalone.html` - the earlier standalone tabbed viewer
