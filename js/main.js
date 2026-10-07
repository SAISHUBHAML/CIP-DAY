// Wires up clicks, form changes and drag-and-drop, then starts the app.

document.addEventListener("click", e => {
  const b = e.target.closest("[data-v],[data-k],[data-a],[data-p]");
  if (!b) return;
  const a = b.dataset.a;
  if (a === "tok" || a === "tokno") {
    ask = a === "tok";
    note("");
    foot();
    if (ask) document.getElementById("tk").focus();
    return
  }
  if (a === "tokok") {
    signin(document.getElementById("tk").value);
    return
  }
  if (a === "out") {
    signout();
    return
  }
  if ((b.dataset.k || b.dataset.p || a) && !edit) return;
  if (b.dataset.p) {
    const W = S.win[view] = S.win[view] || {},
      n = b.dataset.p,
      cur = pod(view),
      i = cur.indexOf(n),
      fr = cur.indexOf(null);
    if (i >= 0) delete W[PK[i]];
    else if (fr >= 0) W[PK[fr]] = n;
    else {
      note("All three places are filled. Tap a placed participant to free one.");
      return
    }
    save();
    render();
    return
  }
  if (a === "addt") {
    addTeam();
    return
  }
  if (a === "delt") {
    const X = ex(view),
      i = +b.dataset.i;
    if (confirm('Remove "' + X[i] + '" from this game? Results already entered may need checking.')) {
      if (S.mem[view]) delete S.mem[view][X[i]];
      X.splice(i, 1);
      S.extra[view] = X;
      save();
      render()
    }
    return
  }
  if (a === "mkt") {
    if (played(view)) return;
    const sz = Math.max(2, Math.min(20, Math.round(+document.getElementById("ts").value) || SZ[view])),
      nm = mk(view).map(p => p[0]),
      u = unit(view),
      n = Math.max(2, Math.round(nm.length / sz));
    for (let i = nm.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nm[i], nm[j]] = [nm[j], nm[i]]
    }
    if (confirm("Make " + n + " random " + u + "s from the " + nm.length + " sign-ups? Existing " + u + "s and results for this game will be cleared.")) {
      const T = [],
        M = {};
      for (let i = 0; i < n; i++) {
        T.push(cap(u) + " " + (i + 1));
        M[T[i]] = nm.filter((_, k) => k % n === i)
      }
      S.extra[view] = T;
      S.mem[view] = M;
      S.win[view] = {};
      S.draw[view] = [];
      tmsg = "";
      save();
      render()
    }
    return
  }
  if (b.dataset.v) {
    view = b.dataset.v;
    q = "";
    tmsg = "";
    dmode = null;
    render();
    window.scrollTo(0, 0)
  } else if (b.dataset.k) {
    const W = S.win[view] = S.win[view] || {};
    if (W[b.dataset.k] === b.dataset.n) delete W[b.dataset.k];
    else W[b.dataset.k] = b.dataset.n;
    save();
    render()
  } else if (a === "addm" || a === "delm") {
    const sl = slots(view),
      dt = dtimes(view),
      W = S.win[view] = S.win[view] || {},
      i = +b.dataset.i;
    if (a === "addm") {
      sl.push("", "");
      dt.push("")
    } else {
      const who = [sl[2 * i], sl[2 * i + 1]].filter(x => x && x !== "BYE");
      if (!confirm("Delete this first-round match" + (who.length ? " (" + who.join(" vs ") + ")" : "") + "? " + (who.length ? "They go back to the unplaced list. " : "") + "Later rounds will be rebuilt.")) return;
      sl.splice(2 * i, 2);
      dt.splice(i, 1);
      // keep first-round results with their matches; later rounds are re-paired, so their results start again
      const N = {};
      Object.keys(W).forEach(k => {
        if (!k.startsWith("0-")) return;
        const j = +k.slice(2);
        if (j !== i) N["0-" + (j > i ? j - 1 : j)] = W[k]
      });
      S.win[view] = N
    }
    S.draw[view] = sl;
    S.dt[view] = dt;
    dmode = true;
    save();
    render()
  } else if (a === "addp") addPlayer();
  else if (a === "delxp") {
    const L = xp(view),
      o = L[+b.dataset.i];
    if (o && confirm('Remove "' + o.n + '" from this game?')) {
      L.splice(+b.dataset.i, 1);
      S.xp[view] = L;
      const M = S.mem[view] || {};
      Object.keys(M).forEach(t => {
        if (Array.isArray(M[t])) M[t] = M[t].filter(n => n !== o.n)
      });
      save();
      render()
    }
  } else if (a === "delp") {
    const t = ex(view)[+b.dataset.i],
      M = S.mem[view];
    if (t && M && Array.isArray(M[t])) {
      M[t] = M[t].filter(n => n !== b.dataset.n);
      save();
      render()
    }
  } else if (a === "mvu" || a === "mvd") {
    const i = +b.dataset.i;
    moveMatch(i, a === "mvu" ? i - 1 : i + 1)
  } else if (a === "ltm") {
    ltmode = !ltmode;
    render()
  } else if (a === "dm") {
    dmode = !(dmode === null ? slots(view).every(x => !x) : dmode);
    render()
  }
});
document.addEventListener("change", e => {
  const i = e.target.dataset ? e.target.dataset.mb : undefined,
    v = e.target.value;
  if (i === undefined || !edit || !v) return;
  const t = ex(view)[+i];
  if (!t || !mk(view).some(p => p[0] === v) || ex(view).some(x => mem(view, x).includes(v))) return;
  const M = S.mem[view] = S.mem[view] || {};
  M[t] = mem(view, t).concat(v);
  save();
  render();
  const n = document.querySelector('[data-mb="' + i + '"]');
  if (n) n.focus()
});
// league score and time boxes: saved without redrawing the cards, so typing is not interrupted; only the points table refreshes
document.addEventListener("change", e => {
  const d = e.target.dataset || {};
  if (!edit || !LEAGUE[view]) return;
  if (d.sc !== undefined) {
    const v = [0, 1].map(i => {
        const x = document.querySelector('[data-sc="' + CSS.escape(d.sc) + '"][data-side="' + i + '"]');
        return x && x.value !== "" ? Math.max(0, Math.min(999, Math.round(+x.value))) : null
      }),
      SC = S.sc[view] = S.sc[view] || {};
    if (v[0] === null || v[1] === null || !Number.isFinite(v[0] + v[1])) delete SC[d.sc];
    else SC[d.sc] = v;
    save();
    const t = document.getElementById("lgt");
    if (t) t.innerHTML = ptable(view)
  } else if (d.lt !== undefined) {
    (S.lt[view] = S.lt[view] || {})[d.lt] = iso(e.target.value);
    save()
  }
});
let dragM = null;
const over = t => document.querySelectorAll(".m.over").forEach(x => x !== t && x.classList.remove("over")),
  card = e => dragM !== null && e.target.closest ? e.target.closest("[data-mt]") : null;
document.addEventListener("dragstart", e => {
  const d = edit && e.target.closest ? e.target.closest("[data-m]") : null;
  if (!d) return;
  dragM = +d.dataset.m;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", "match");
  const c = d.closest(".m");
  if (c && e.dataTransfer.setDragImage) e.dataTransfer.setDragImage(c, 20, 14)
});
document.addEventListener("dragover", e => {
  const t = card(e);
  if (!t) return;
  e.preventDefault();
  over(t);
  t.classList.add("over")
});
document.addEventListener("drop", e => {
  const t = card(e);
  if (!t) return;
  e.preventDefault();
  const f = dragM;
  dragM = null;
  moveMatch(f, +t.dataset.mt)
});
document.addEventListener("dragend", () => {
  dragM = null;
  over()
});
document.addEventListener("change", e => {
  const t = e.target.dataset ? e.target.dataset.t : undefined;
  if (t === undefined || !edit) return;
  // saved without redrawing, so the date box keeps focus while it is being filled in
  const v = iso(e.target.value);
  if (t.startsWith("0-")) {
    const dt = dtimes(view);
    dt[+t.slice(2)] = v;
    S.dt[view] = dt
  } else(S.rt[view] = S.rt[view] || {})[t] = v;
  save()
});
document.addEventListener("change", e => {
  const s = e.target.dataset ? e.target.dataset.s : undefined;
  if (s === undefined || !edit) return;
  const sl = slots(view),
    i = +s;
  sl[i] = e.target.value;
  S.draw[view] = sl;
  if (S.win[view]) delete S.win[view]["0-" + (i >> 1)];
  dmode = true;
  save();
  render();
  const n = document.querySelector('[data-s="' + i + '"]');
  if (n) n.focus()
});
render();
foot();
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  if (e.target.id === "tk") signin(e.target.value);
  else if (e.target.id === "tn" && edit) addTeam();
  else if (e.target.id === "pn" && edit) addPlayer()
});
if (GH) {
  if (tok) signin(tok, true);
  else pull();
  setInterval(() => {
    if (!pend && !document.hidden) pull()
  }, 30000)
}
