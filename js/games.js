// Game rules: who is in each game, teams, knockout brackets, the league, and progress.

// match time: first-round times travel with their match (S.dt) when organisers add or delete matches
const dtimes = g => {
  const n = slots(g).length / 2,
    D = Array.isArray(S.dt[g]) ? S.dt[g] : null;
  return Array.from({
    length: n
  }, (_, i) => iso(D ? D[i] : TIMES[g] && TIMES[g]["0-" + i]))
};
const tm = (g, k) => {
  if (LEAGUE[g]) {
    const m = lg(g).all.find(m => m.k === k);
    return m ? m.t : ""
  }
  if (k.startsWith("0-")) return dtimes(g)[+k.slice(2)] || "";
  const r = S.rt[g];
  return iso(r && k in r ? r[k] : TIMES[g] && TIMES[g][k])
};
const tkey = (g, m) => tm(g, m.k) || "~",
  byt = (g, a, b) => tkey(g, a) < tkey(g, b) ? -1 : tkey(g, a) > tkey(g, b) ? 1 : 0;
const tmx = (g, k) => tm(g, k) ? ", " + fmt(tm(g, k)) : "";
// players organisers add to a team game who did not sign up: [{n:name,g:"M"|"F"}]
const xp = g => (Array.isArray(S.xp[g]) ? S.xp[g] : []).filter(o => o && typeof o.n === "string" && o.n).map(o => ({
  n: o.n,
  g: o.g === "F" ? "F" : "M"
}));
const mk = g => P.filter(p => p[5].includes(g)).concat(xp(g).map(o => [o.n, "", "Added", o.g, "Added by organisers", g]));
const gi = g => G.find(x => x[0] === g);
// teams added by organisers, per game (saved with the results)
const ex = g => (Array.isArray(S.extra[g]) ? S.extra[g] : []).filter(x => typeof x === "string" && x);
let tmsg = "";
// NOKO: single events decided by 1st/2nd/3rd. TEAM: entries are teams formed by organisers, not individuals.
const TEAM = ["v", "w", "r", "h"],
  SZ = {
    v: 6,
    w: 8,
    r: 2,
    h: 4
  },
  unit = g => g === "r" ? "pair" : "team",
  cap = s => s[0].toUpperCase() + s.slice(1);
const ents = g => (TEAM.includes(g) ? [] : mk(g).map(p => p[0])).concat(ex(g)),
  ready = g => !TEAM.includes(g) || ex(g).length >= 2;
const played = g => NOKO.includes(g) ? pod(g).some(x => x) : ready(g) && prog(g)[0] > 0;
const mem = (g, t) => {
  const M = S.mem[g] && S.mem[g][t];
  return Array.isArray(M) ? M.filter(x => typeof x === "string") : []
};
const NOKO = ["s", "l", "r", "h"],
  PK = ["p0", "p1", "p2"],
  PL = ["1st", "2nd", "3rd"],
  MD = ["\u{1F947}", "\u{1F948}", "\u{1F949}"]; // games without a knockout bracket
const pod = g => {
  const W = S.win[g] || {},
    all = ents(g);
  return PK.map(k => all.includes(W[k]) ? W[k] : null)
};

function addPlayer() {
  const t = document.getElementById("pn").value.trim().replace(/\s+/g, " ").slice(0, 60),
    lc = t.toLowerCase(),
    gd = document.getElementById("pg").value === "F" ? "F" : "M";
  if (!t) return;
  if (lc === "bye" || lc === "tbd" || mk(view).map(p => p[0]).concat(ex(view)).some(n => n.toLowerCase() === lc)) {
    tmsg = '"' + t + '" is already in this game.';
    render();
    return
  }
  (S.xp[view] = xp(view)).push({
    n: t,
    g: gd
  });
  tmsg = "";
  save();
  render()
}

function addTeam() {
  const t = document.getElementById("tn").value.trim().replace(/\s+/g, " ").slice(0, 60),
    lc = t.toLowerCase();
  if (!t) return;
  if (lc === "bye" || lc === "tbd" || mk(view).map(p => p[0]).concat(ex(view)).some(n => n.toLowerCase() === lc)) {
    tmsg = '"' + t + '" is already in this game.';
    render();
    return
  }
  (S.extra[view] = ex(view)).push(t);
  tmsg = "";
  save();
  render()
}
let view = "home",
  q = "";
// Round 1 is placed by the organisers: one slot per bracket position, "" = not chosen yet.
// Badminton starts from the organisers' own draw (FIX) until they change it.
function slots(g) {
  const pool = ents(g),
    ok = x => x === "BYE" || pool.includes(x) ? x : "",
    E = S.draw[g];
  if (Array.isArray(E) && E.length >= 2) {
    const D = E.map(ok);
    if (D.length % 2) D.push("");
    return D
  }
  const D = (FIX[g] ? FIX[g].flat() : []).map(ok);
  let size = 2;
  while (size < pool.length || size < D.length) size *= 2;
  return Array.from({
    length: size
  }, (_, i) => D[i] || "")
}

function moveMatch(i, j) {
  const sl = slots(view),
    dt = dtimes(view),
    n = dt.length;
  if (i === j || i < 0 || j < 0 || i >= n || j >= n) return;
  const ord = [...Array(n).keys()];
  ord.splice(j, 0, ord.splice(i, 1)[0]);
  // players, time and first-round result travel with the match; later rounds are re-paired
  const W = S.win[view] || {},
    N = {};
  Object.keys(W).forEach(k => {
    if (k.startsWith("0-")) {
      const p = ord.indexOf(+k.slice(2));
      if (p >= 0) N["0-" + p] = W[k]
    }
  });
  S.draw[view] = ord.flatMap(o => [sl[2 * o], sl[2 * o + 1]]);
  S.dt[view] = ord.map(o => dt[o]);
  S.win[view] = N;
  dmode = true;
  save();
  render()
}

function build(g) {
  const sl = slots(g),
    W = S.win[g] || {},
    R = [];
  let cur = [];
  for (let i = 0; i < sl.length; i += 2) cur.push({
    a: sl[i] || "TBD",
    b: sl[i + 1] || "TBD"
  });
  for (let d = 0;; d++) {
    cur.forEach((m, i) => {
      m.k = d + "-" + i;
      m.bye = m.a === "BYE" || m.b === "BYE";
      const o = m.a === "BYE" ? m.b : m.a;
      m.w = m.bye ? (o === "TBD" ? null : o) : (m.a === "TBD" || m.b === "TBD") ? null : ([m.a, m.b].includes(W[m.k]) ? W[m.k] : null)
    });
    R.push(cur);
    if (cur.length === 1) break;
    const nx = [];
    for (let i = 0; i < cur.length; i += 2) nx.push({
      a: cur[i].w || "TBD",
      b: cur[i + 1] ? cur[i + 1].w || "TBD" : "BYE"
    });
    cur = nx
  }
  return R
}
let dmode = null; // placing mode for Round 1: null = automatic (on while the draw is empty)
const rname = (l, i) => l === 1 ? "Final" : l === 2 ? "Semi-finals" : l <= 4 ? "Quarter-finals" : "Round " + (i + 1);
// League games: every team plays every other team once, 2 points a win, top two play the final.
// start = first match, gap = minutes between matches (organisers can change any time on the page).
const LEAGUE = {
  v: {
    start: "2026-10-09T21:00",
    gap: 30
  }
};
const addMin = (s, n) => {
  const [y, mo, d, h, m] = s.split(/[-T:]/).map(Number), t = new Date(y, mo - 1, d, h, m + n), p = x => String(x).padStart(2, "0");
  return t.getFullYear() + "-" + p(t.getMonth() + 1) + "-" + p(t.getDate()) + "T" + p(t.getHours()) + ":" + p(t.getMinutes())
};

function lg(g) {
  const T = ex(g),
    W = S.win[g] || {},
    SC = S.sc[g] || {},
    LT = S.lt[g] || {},
    n = T.length,
    cf = LEAGUE[g],
    M = [];
  // round-robin by the circle method, ordered so 4 teams give 1v2, 3v4, 1v3, 2v4, 1v4, 2v3
  const a = [0];
  for (let i = 2; i < n; i++) a.push(i);
  if (n > 1) a.push(1);
  if (a.length % 2) a.push(-1);
  for (let r = 0; r < a.length - 1; r++) {
    for (let i = 0; i < a.length / 2; i++) {
      const x = a[i],
        y = a[a.length - 1 - i];
      if (x >= 0 && y >= 0) M.push({
        a: T[Math.min(x, y)],
        b: T[Math.max(x, y)]
      })
    }
    a.push(a.splice(1, 1)[0])
  }
  const fill = (m, i) => {
    m.bye = false;
    m.w = [m.a, m.b].includes(W[m.k]) && m.a !== "TBD" && m.b !== "TBD" ? W[m.k] : null;
    const s = SC[m.k];
    m.sc = Array.isArray(s) && s.length === 2 && s.every(x => Number.isFinite(x) && x >= 0) ? s : null;
    m.t = iso(m.k in LT ? LT[m.k] : addMin(cf.start, cf.gap * i))
  };
  M.forEach((m, i) => {
    m.k = "L:" + m.a + "|" + m.b;
    m.lb = "League match " + (i + 1);
    fill(m, i)
  });
  const tb = T.map((t, i) => ({
    n: t,
    i,
    p: 0,
    w: 0,
    l: 0,
    pd: 0
  }));
  M.forEach(m => {
    const A = tb.find(x => x.n === m.a),
      B = tb.find(x => x.n === m.b);
    if (m.w) {
      A.p++;
      B.p++;
      (m.w === m.a ? A : B).w++;
      (m.w === m.a ? B : A).l++
    }
    if (m.sc) {
      A.pd += m.sc[0] - m.sc[1];
      B.pd += m.sc[1] - m.sc[0]
    }
  });
  tb.sort((x, y) => y.w - x.w || y.pd - x.pd || x.i - y.i);
  const done = M.length > 0 && M.every(m => m.w),
    fin = {
      a: done ? tb[0].n : "TBD",
      b: done ? tb[1].n : "TBD",
      k: "F",
      lb: "Final"
    };
  fill(fin, M.length);
  return {
    M,
    tb,
    fin,
    done,
    all: M.concat(fin)
  }
}

function prog(g) {
  if (!ready(g)) return [0, 0, []];
  if (LEAGUE[g]) {
    const A = lg(g).all;
    return [A.filter(m => m.w).length, A.length, [A]]
  }
  if (NOKO.includes(g)) return [pod(g)[0] ? 1 : 0, 1, []];
  const R = build(g);
  let d = 0,
    t = 0;
  R.flat().forEach(m => {
    if (!m.bye) {
      t++;
      if (m.w) d++
    }
  });
  return [d, t, R]
}
