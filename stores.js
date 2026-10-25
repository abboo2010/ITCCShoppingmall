// DUMMY DATA: sample stores for the demo. Replace with the real ITCC tenants.
// Later (step 2) this file gets replaced by an Excel import / Supabase table.
// level: "Ground Floor", "First Floor", "Second Floor" or "Third Floor"
// category: "Fashion", "Food", "Kids" or "Services"
// logo: optional file name in the /logos folder, e.g. "logos/store.png"
window.ITCC_STORES = [
  { name: "Sabah Threads",        category: "Fashion",  unit: "G-01", level: "Ground Floor", logo: "" },
  { name: "Urban Batik",          category: "Fashion",  unit: "G-02", level: "Ground Floor", logo: "" },
  { name: "Kinabalu Footwear",    category: "Fashion",  unit: "G-05", level: "Ground Floor", logo: "" },
  { name: "Style Avenue",         category: "Fashion",  unit: "1-03", level: "First Floor",  logo: "" },
  { name: "Jewel Box Gold",       category: "Fashion",  unit: "1-08", level: "First Floor",  logo: "" },
  { name: "Borneo Bakery",        category: "Food",     unit: "G-12", level: "Ground Floor", logo: "" },
  { name: "Kopi Corner",          category: "Food",     unit: "G-14", level: "Ground Floor", logo: "" },
  { name: "Spice Route Kitchen",  category: "Food",     unit: "1-05", level: "First Floor",  logo: "" },
  { name: "Sweet Tooth Dessert",  category: "Food",     unit: "1-06", level: "First Floor",  logo: "" },
  { name: "Little Explorers",     category: "Kids",     unit: "2-01", level: "Second Floor", logo: "" },
  { name: "Toy Planet",           category: "Kids",     unit: "2-02", level: "Second Floor", logo: "" },
  { name: "Play Zone Arcade",     category: "Kids",     unit: "2-05", level: "Second Floor", logo: "" },
  { name: "Mini Fashion Kids",    category: "Kids",     unit: "2-07", level: "Second Floor", logo: "" },
  { name: "Quick Tech Repair",    category: "Services", unit: "G-10", level: "Ground Floor", logo: "" },
  { name: "Glow Beauty Salon",    category: "Services", unit: "G-11", level: "Ground Floor", logo: "" },
  { name: "Penampang Pharmacy",   category: "Services", unit: "1-01", level: "First Floor",  logo: "" },
  { name: "Cityfix Optical",      category: "Services", unit: "1-02", level: "First Floor",  logo: "" },
  { name: "Swift Print & Copy",   category: "Services", unit: "1-10", level: "First Floor",  logo: "" }
];

// DUMMY DATA: events and promotions shown on the homepage.
window.ITCC_EVENTS = [
  { date: "12 – 26 Oct 2026", title: "Deepavali Festive Sale: up to 60% off",         style: "yellow" },
  { date: "Every Saturday",   title: "Kids Fun Day: face painting and games",          style: "red" },
  { date: "Opening 1 Nov",    title: "New Store Opening: Toy Planet, Second Floor",         style: "white" },
  { date: "7 – 9 Nov 2026",   title: "Sabah Food Fair at the Atrium",                  style: "white" },
  { date: "Weekends",         title: "Live Acoustic Music, 7 PM at the Food Court",    style: "yellow" },
  { date: "All December",     title: "Christmas Lucky Draw: spend RM100, win prizes",  style: "red" }
];

// DUMMY DATA: opening hours (24h, Malaysia time). Update to the real hours.
window.ITCC_HOURS = { open: 10, close: 22 };
