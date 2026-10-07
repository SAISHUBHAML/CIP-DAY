// Small helpers: HTML escaping and date/time formatting.

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
// times are kept as "2026-10-08T20:30"; the older "8,20:30" form (day of October) is still read
const iso = s => {
  if (typeof s !== "string") return "";
  if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(s)) return s;
  const m = /^(\d{1,2}),(\d\d:\d\d)$/.exec(s);
  return m ? "2026-10-" + m[1].padStart(2, "0") + "T" + m[2] : ""
};
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = s => {
  const [y, mo, d, h, m] = s.split(/[-T:]/).map(Number);
  return d + " " + MON[mo - 1] + ", " + ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + (h < 12 ? "AM" : "PM")
};
