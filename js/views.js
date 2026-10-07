// Builds the HTML for each page: overview, coordinators, and the three kinds of game page.

function head() {
  const tot = P.reduce((a, p) => a + p[5].length, 0);
  document.getElementById("stats").innerHTML = [
    [P.length, "students"],
    [8, "games"],
    [tot, "sign-ups"],
    [P.filter(p => p[3] === "F").length, "women participants"]
  ].map(x => `<div class="st"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
  document.getElementById("nav").innerHTML = [
    ["home", "\u{1F3E0} Overview"]
  ].concat(G.map(g => [g[0], g[2] + " " + g[1]]), [
    ["co", "\u{1F91D} Coordinators"]
  ]).map(x => `<button class="${view===x[0]?"on":""}" data-v="${x[0]}">${x[1]}</button>`).join("")
}
const cards = () => `<div class="cg">${C.map(c=>`<div class="cc">${c[3]?`<img src="${esc(c[3])}" alt="${esc(c[0])}" loading="lazy" width="96" height="96">`:`<div class="ini" aria-hidden="true">${esc(c[0][0])}</div>`}<h3>${esc(c[0])}</h3><div class="small">${esc(c[1])}</div>${c[2]?`<a href="https://www.instagram.com/${encodeURIComponent(c[2])}/" target="_blank" rel="noopener" aria-label="${esc(c[0])} on Instagram">@${esc(c[2])}</a>`:""}</div>`).join("")}</div>`;

function coord() {
  return `<div class="top"><h2>\u{1F91D} Coordinators</h2></div><p class="small">The people running CIP Day 2026. Reach out to them for anything about the games.</p>${cards()}`
}

function home() {
  const mx = Math.max(...G.map(g => mk(g[0]).length));
  let h = '<div class="grid">' + G.map(g => {
    const L = mk(g[0]),
      f = L.filter(p => p[3] === "F").length,
      [d, t] = prog(g[0]);
    return `<button class="gc" data-v="${g[0]}"><div class="e">${g[2]}</div><h3>${g[1]}</h3><div><b style="font-size:24px">${L.length}</b> <span class="small">players (${L.length-f} M, ${f} F)${ex(g[0]).length?(TEAM.includes(g[0])?", "+ex(g[0]).length+" "+unit(g[0])+(ex(g[0]).length===1?"":"s"):", + "+ex(g[0]).length+" added"):""}</span></div><div class="bar"><i style="width:${L.length/mx*100}%"></i></div><div class="bar g"><i style="width:${t?d/t*100:0}%"></i></div><div class="small">${!ready(g[0])?cap(unit(g[0]))+"s not formed yet":NOKO.includes(g[0])?(pod(g[0])[0]?"Winner: "+esc(pod(g[0])[0]):"Single event, result pending"):d+" of "+t+" matches played"}</div></button>`
  }).join("") + "</div>";
  const nx = [];
  G.forEach(g => {
    const R = prog(g[0])[2];
    R.forEach((r, i) => r.forEach(m => {
      if (!m.bye && !m.w && m.a !== "TBD" && m.b !== "TBD") nx.push([g, m, m.lb || rname(R[i].length, i)])
    }))
  });
  const grp = G.map(g => [g, nx.filter(x => x[0] === g).sort((x, y) => byt(g[0], x[1], y[1]))]).filter(x => x[1].length);
  h += `<div class="box"><h2>Next matches to play</h2>${nx.length?`<div class="cols">${grp.map(([g,l])=>`<div class="grp"><button class="gh" data-v="${g[0]}"><span>${g[2]} ${g[1]}</span><small>${l.length} ready</small></button>${l.slice(0,4).map(x=>`<div class="mr"><span>${esc(x[1].a)} <i>vs</i> ${esc(x[1].b)}</span><small>${x[2]}${tmx(g[0],x[1].k)}</small></div>`).join("")}${l.length>4?`<div class="small more">+ ${l.length-4} more in ${g[1]}</div>`:""}</div>`).join("")}</div>`:'<span class="small">No matches waiting.</span>'}<p class="small">${nx.length} matches are ready across ${grp.length} games, earliest first. Tap a game name to see its bracket.</p></div>`;
  h += `<div class="box"><h2>Coordinators</h2>${cards()}</div>`;
  if (edit) h += `<div class="box"><h2>Check before the event (organisers only)</h2><div class="flag">Pranav Varadpande's mobile number is incomplete in the form responses.</div><div class="flag">Badminton: Sumitkumar Chandanshive is in two Round 1 matches (Group 1 match 3 and Group 2 match 3). Neha Mishra, Rubleen Khosa and Pranav Varadpande are not in the schedule. Fix both on the Badminton page with Edit draw.</div><div class="flag">Volleyball, Tug of War and Beg Borrow Steal need teams, and Three Leg Race needs pairs. Form them on each game's page before the event.</div></div>`;
  return h
}

function tail(g, L, X) {
  let h = "";
  const T = TEAM.includes(g),
    u = unit(g),
    U = cap(u),
    ql = q.toLowerCase();
  const taken = X.flatMap(x => mem(g, x)),
    free = L.map(p => p[0]).filter(n => !taken.includes(n)).sort((a, b) => a.localeCompare(b)),
    gen = n => {
      const p = L.find(p => p[0] === n);
      return p ? " (" + p[3] + ")" : ""
    },
    XP = xp(g);
  if (T) h += `<div class="box"><h2>${U}s</h2>${X.length?`<div class="cols">${X.map((x,i)=>{const M=mem(g,x);return `<div class="grp"><div class="gh st"><span>${esc(x)}</span>${edit?`<button class="rm" data-a="delt" data-i="${i}" aria-label="Remove ${esc(x)}">Remove</button>`:`<small>${M.length?M.length+" players":""}</small>`}</div>${edit?`<div class="mr mb">${M.length?M.map(n=>`<span class="chip">${esc(n)}${gen(n)} <button class="rm" data-a="delp" data-i="${i}" data-n="${esc(n)}" aria-label="Remove ${esc(n)} from ${esc(x)}">×</button></span>`).join(""):'<span class="small">No members yet</span>'}</div><select data-mb="${i}" aria-label="Add a player to ${esc(x)}"${free.length?"":" disabled"}><option value="">${free.length?"Add a player...":"Everyone is in a "+u}</option>${free.map(n=>`<option value="${esc(n)}">${esc(n)}${gen(n)}</option>`).join("")}</select>`:`<div class="mr"><span>${M.length?M.map(esc).join(", "):"Members not listed"}</span></div>`}</div>`}).join("")}</div>${edit?`<p class="small">${free.length?free.length+" of "+L.length+" sign-ups are not in a "+u+" yet.":"All "+L.length+" sign-ups are in a "+u+"."}</p>`:""}`:`<span class="small">${U}s have not been formed yet. Everyone who signed up is listed below.</span>`}</div>`;
  if (edit) h += `<div class="box"><h2>${T?"Form "+u+"s":"Add a player"}</h2>` + (T ? `<p class="small">Add a ${u} by name, then pick its members in the ${U}s box above. Or split the ${L.length} sign-ups into random ${u}s and adjust them afterwards. ${NOKO.includes(g)?"":LEAGUE[g]?"League matches are made automatically from the "+u+"s.":"Then place the "+u+"s in the bracket above with Edit draw."}</p><p><label for="ts">Players per ${u}</label> <input type="number" id="ts" min="2" max="20" value="${SZ[g]}"> <span class="act"><button data-a="mkt"${played(g)?" disabled":""}>Make random ${u}s</button></span></p>${played(g)?`<p class="small">Random ${u}s are switched off because this game already has results.</p>`:""}` : `<p class="small">${NOKO.includes(g)?"Adds a participant who did not sign up for this game.":"Adds a player who did not sign up for this game. Then place them in the bracket above with Edit draw."}</p>`) + `<input type="text" id="tn" maxlength="60" placeholder="${T?U+" name":"Player name"}" aria-label="${T?U+" name":"Player name"}"> <span class="act"><button data-a="addt">Add ${T?u:"player"}</button></span>${tmsg?`<div class="flag">${esc(tmsg)}</div>`:""}${!T&&X.length?`<div class="next" style="margin-top:10px">${X.map((x,i)=>`<div class="chip">${esc(x)} <button class="rm" data-a="delt" data-i="${i}" aria-label="Remove ${esc(x)}">Remove</button></div>`).join("")}</div>`:""}${T?`<h2 style="margin-top:16px">Add a player</h2><p class="small">For someone who did not sign up for this game. They join the list below and can then be picked for a ${u}.</p><input type="text" id="pn" maxlength="60" placeholder="Player name" aria-label="Player name"> <select id="pg" aria-label="Gender"><option value="M">Male</option><option value="F">Female</option></select> <span class="act"><button data-a="addp">Add player</button></span>${XP.length?`<div class="next" style="margin-top:10px">${XP.map((o,i)=>`<div class="chip">${esc(o.n)} (${o.g}) <button class="rm" data-a="delxp" data-i="${i}" aria-label="Remove ${esc(o.n)}">Remove</button></div>`).join("")}</div>`:""}`:""}</div>`;
  h += `<div class="box"><h2>${T?"Signed-up players":"Players"}</h2><input type="search" id="q" placeholder="Search name or branch" value="${esc(q)}"><div class="tw"><table><tr><th>#</th><th>Name</th><th>Class</th><th>Gender</th><th>Branch</th></tr>${L.filter(p=>(p[0]+p[4]).toLowerCase().includes(ql)).map((p,i)=>`<tr><td>${i+1}</td><td>${esc(p[0])}</td><td>${p[2]}</td><td>${p[3]}</td><td>${esc(p[4])}</td></tr>`).join("")}${T?"":X.filter(x=>x.toLowerCase().includes(ql)).map(x=>`<tr><td>+</td><td>${esc(x)}</td><td colspan="3">Added by organisers</td></tr>`).join("")}</table></div></div>`;
  return h
}
// single-event games: no bracket, organisers record 1st/2nd/3rd
function race(g) {
  const info = gi(g),
    L = mk(g),
    X = ex(g),
    W = pod(g),
    all = ents(g),
    T = TEAM.includes(g),
    u = unit(g);
  let h = `<div class="top"><h2>${info[2]} ${info[1]}</h2></div>
 <p class="small">${T?X.length+" "+u+"s from "+L.length+" sign-ups":all.length+" participants"}. Single event with no knockout rounds.</p>`;
  if (!ready(g)) return h + `<div class="box"><h2>Results</h2><span class="small">Places can be recorded once at least two ${u}s are formed.</span></div>` + tail(g, L, X);
  if (W[0]) h += `<div class="champ">\u{1F3C6} Winner: ${esc(W[0])}</div>`;
  h += `<div class="box"><h2>Results</h2><div class="next">${PL.map((p,i)=>`<div class="chip">${MD[i]} ${p} place<small>${W[i]?esc(W[i]):"Pending"}</small></div>`).join("")}</div>`;
  if (edit) h += `<p class="small">Tap a ${T?u:"participant"} to give them the next free place. Tap a placed one to take their place away.</p><div class="next">${all.map(n=>{const i=W.indexOf(n);return `<button class="pk${i>=0?" on":""}" data-p="${esc(n)}">${i>=0?MD[i]+" ":""}${esc(n)}</button>`}).join("")}</div>`;
  return h + "</div>" + tail(g, L, X)
}
let ltmode = false; // organisers editing league match times
const ptable = g => {
  const L = lg(g);
  return `<div class="tw"><table><tr><th>#</th><th>Team</th><th>Played</th><th>Won</th><th>Lost</th><th>Points</th><th>Point diff</th></tr>${L.tb.map((t,i)=>`<tr class="${i<2?"q":""}"><td>${i+1}</td><td>${esc(t.n)}</td><td>${t.p}</td><td>${t.w}</td><td>${t.l}</td><td><b>${t.w*2}</b></td><td>${t.pd>0?"+":""}${t.pd}</td></tr>`).join("")}</table></div>`
};

function league(g) {
  const info = gi(g),
    L = mk(g),
    X = ex(g),
    D = lg(g),
    A = D.all,
    d = A.filter(m => m.w).length;
  let h = `<div class="top"><h2>${info[2]} ${info[1]}</h2></div>
 <p class="small">${X.length} teams from ${L.length} sign-ups, ${d} of ${A.length} matches played. Each team plays every other team once; the top two on points play the final.</p><div class="bar g"><i style="width:${d/A.length*100}%"></i></div>`;
  if (D.fin.w) h += `<div class="champ">\u{1F3C6} Champion: ${esc(D.fin.w)}</div>`;
  h += `<div class="box"><h2>Points table</h2><div id="lgt">${ptable(g)}</div><p class="small">Win = 2 points, loss = 0. Teams level on points are separated by point difference (points scored minus points conceded). The top two, shaded, play the final.</p></div>`;
  const card = m => {
    const ok = edit && m.a !== "TBD" && m.b !== "TBD",
      nm = (x, i) => x === "TBD" ? "Rank " + (i + 1) + " (after league matches)" : x;
    const pb = (x, i) => `<button class="pl ${x==="TBD"?"tbd":m.w?(m.w===x?"win":"lose"):""}" ${ok?`data-k="${esc(m.k)}" data-n="${esc(x)}"`:"disabled"}><span>${esc(nm(x,i))}</span>${m.sc?`<span class="scv">${m.sc[i]}</span>`:""}</button>`;
    const si = i => `<input class="sc" type="number" min="0" max="999" inputmode="numeric" data-sc="${esc(m.k)}" data-side="${i}" value="${m.sc?m.sc[i]:""}" aria-label="Points scored by ${esc(nm(i?m.b:m.a,i))}">`;
    return `<div class="m ${ok&&!m.w?"rdy":""}"><div class="tm">${m.lb}${m.t?" · "+fmt(m.t):""}</div>${pb(m.a,0)}${pb(m.b,1)}${ok?`<div class="lrow">Points scored ${si(0)} – ${si(1)}</div>`:""}${edit&&ltmode?`<input type="datetime-local" class="ti" data-lt="${esc(m.k)}" value="${esc(m.t)}" aria-label="Date and time, ${m.lb}">`:""}</div>`
  };
  h += `<div class="box"><div class="bh"><h2>Match schedule</h2>${edit?`<span class="act"><button data-a="ltm">${ltmode?"Done":"Edit times"}</button></span>`:""}</div>${edit?`<p class="small">Tap a team to mark it the winner. Enter the points each team scored so that ties on the points table can be broken.</p>`:""}<div class="cols">${A.map(card).join("")}</div></div>`;
  return h + tail(g, L, X)
}

function game(g) {
  if (NOKO.includes(g)) return race(g);
  if (!ready(g)) {
    const i = gi(g),
      L = mk(g);
    return `<div class="top"><h2>${i[2]} ${i[1]}</h2></div><p class="small">${L.length} sign-ups. The ${LEAGUE[g]?"league table":"bracket"} appears once at least two teams are formed.</p>` + tail(g, L, ex(g))
  }
  if (LEAGUE[g]) return league(g);
  const [d, t, R] = prog(g), info = gi(g), L = mk(g), X = ex(g), fin = R[R.length - 1][0];
  let h = `<div class="top"><h2>${info[2]} ${info[1]}</h2></div>
 <p class="small">${TEAM.includes(g)?X.length+" teams from "+L.length+" sign-ups":L.length+" players"+(X.length?", "+X.length+" added by organisers":"")}, ${d} of ${t} matches played. The organisers set the draw. Byes move straight to the next round.</p><div class="bar g"><i style="width:${t?d/t*100:0}%"></i></div>`;
  if (fin.w) h += `<div class="champ">\u{1F3C6} Champion: ${esc(fin.w)}</div>`;
  const nx = [];
  R.forEach((r, i) => r.forEach(m => {
    if (!m.bye && !m.w && m.a !== "TBD" && m.b !== "TBD") nx.push([m, rname(r.length, i)])
  }));
  const pn = `<div class="box"><h2>Play next</h2><div class="${nx.length?"cols":"next"}">${nx.length?nx.sort((x,y)=>byt(g,x[0],y[0])).map(x=>`<div class="chip">${esc(x[0].a)} vs ${esc(x[0].b)}<small>${x[1]}${tmx(g,x[0].k)}</small></div>`).join(""):'<span class="small">Nothing waiting right now.</span>'}</div></div>`;
  let sch = "";
  {
    const rw = [];
    R.forEach(r => r.forEach(m => {
      if (tm(g, m.k) && !m.bye) rw.push([tm(g, m.k), m])
    }));
    rw.sort((x, y) => x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0);
    if (rw.length) sch = `<div class="box"><h2>Match schedule (tentative)</h2><div class="tw"><table><tr><th>Time</th><th>Round</th><th>Match</th><th>Result</th></tr>${rw.map(x=>`<tr><td>${fmt(x[0])}</td><td>Round ${+x[1].k[0]+1}</td><td>${esc(x[1].a)} vs ${esc(x[1].b)}</td><td>${x[1].w?"Winner: "+esc(x[1].w):"Pending"}</td></tr>`).join("")}</table></div></div>`
  }
  const sl = slots(g),
    dm = edit && (dmode === null ? sl.every(x => !x) : dmode),
    pool = ents(g).sort((x, y) => x.localeCompare(y)),
    isT = TEAM.includes(g);
  const lab = n => {
    const p = !isT && P.find(p => p[0] === n);
    return p ? n + " (" + p[3] + ")" : n
  };
  const sel = i => `<select data-s="${i}" aria-label="Round 1, slot ${i+1}"><option value="">Select ${isT?"team":"player"}...</option>${pool.filter(n=>n===sl[i]||!sl.includes(n)).map(n=>`<option value="${esc(n)}"${n===sl[i]?" selected":""}>${esc(lab(n))}</option>`).join("")}<option value="BYE"${sl[i]==="BYE"?" selected":""}>BYE (no opponent)</option></select>`;
  h += `<div class="box"><div class="bh"><h2>Knockout bracket</h2>${edit?`<span class="act"><button data-a="dm">${dm?"Done placing":"Edit draw"}</button></span>`:""}</div>${dm?`<p class="small">Choose who goes in each first-round slot${isT?"":" (M or F is shown next to each name)"}. Pick BYE where there is no opponent. Use "Add match" and "Delete match" to change how many first-round matches there are; the later rounds adjust on their own. Set a match's date and time in the box above its players. To reorder, drag a match by its "Match" strip or use the arrows. Press "Done placing" to start recording winners.</p>`:""}<div class="br">` + R.map((r, ri) => `<div class="rd"><h4>${rname(r.length,ri)}</h4>${r.map((m,mi)=>{
  const c=x=>x==="BYE"?"bye":x==="TBD"?"tbd":m.w?(m.w===x?"win":"lose"):"";
  const ok=x=>edit&&x!=="TBD"&&x!=="BYE"&&!m.bye&&m.a!=="TBD"&&m.b!=="TBD";
  const pb=x=>`<button class="pl ${c(x)}" ${ok(x)?`data-k="${m.k}" data-n="${esc(x)}"`:"disabled"}>${esc(x)}</button>`;
  const tt=tm(g,m.k)?`<div class="tm">${fmt(tm(g,m.k))}</div>`:"";
  const tin=`<input type="datetime-local" class="ti" data-t="${m.k}" value="${esc(tm(g,m.k))}" aria-label="Date and time, ${rname(r.length,ri)} match ${mi+1}">`;
  if(dm&&!ri)return `<div class="m" data-mt="${mi}"><div class="dh" draggable="true" data-m="${mi}" title="Drag to move this match"><span>⠿ Match ${mi+1}</span><span><button data-a="mvu" data-i="${mi}" aria-label="Move match ${mi+1} up"${mi?"":" disabled"}>▲</button><button data-a="mvd" data-i="${mi}" aria-label="Move match ${mi+1} down"${mi<r.length-1?"":" disabled"}>▼</button></span></div>${tin}${sel(2*mi)}${sel(2*mi+1)}${r.length>1?`<button class="dl" data-a="delm" data-i="${mi}" aria-label="Delete match ${mi+1}">Delete match</button>`:""}</div>`;
  return `<div class="m ${!m.bye&&!m.w&&m.a!=="TBD"&&m.b!=="TBD"?"rdy":""}">${dm&&!m.bye?tin:tt}${pb(m.a)}${pb(m.b)}</div>`}).join("")}${dm&&!ri?'<button class="am" data-a="addm">+ Add match</button>':""}</div>`).join("") + "</div></div>" + pn + sch;
  h += tail(g, L, X);
  return h
}

function render() {
  head();
  const m = document.getElementById("main"),
    o = document.getElementById("q"),
    p = o && document.activeElement === o ? o.selectionStart : -1;
  document.getElementById("sub").textContent = "Who is playing what, and live knockout brackets. " + (edit ? "Tap a player in a match to mark them the winner." : "Results are updated by the organisers.");
  m.innerHTML = view === "home" ? home() : view === "co" ? coord() : game(view);
  const s = document.getElementById("q");
  if (s) {
    s.oninput = e => {
      q = e.target.value;
      render()
    };
    if (p >= 0) {
      s.focus();
      s.setSelectionRange(p, p)
    }
  }
}
