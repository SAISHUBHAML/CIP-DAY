// Shared state. Results live in results.json in the GitHub repo: everyone reads it,
// and organisers (signed in with a token that can write to the repo) save changes to it.

// Results live in results.json in the GitHub repo. Everyone reads it; only people with
// write access to the repo (signed in below with their own token) can change it.
const REPO = ""; // set to "owner/repo" only if the page is not served from owner.github.io/repo
const H = location.hostname,
  seg = location.pathname.split("/")[1] || "";
const GH = REPO || (H.endsWith(".github.io") ? H.split(".")[0] + "/" + (seg && !seg.includes(".") ? seg : H) : "");
const API = "https://api.github.com/repos/" + GH,
  FILE = "results.json";
const norm = x => ({
  seed: (x && x.seed) || {},
  win: (x && x.win) || {},
  extra: (x && x.extra) || {},
  mem: (x && x.mem) || {},
  draw: (x && x.draw) || {},
  dt: (x && x.dt) || {},
  rt: (x && x.rt) || {},
  xp: (x && x.xp) || {},
  sc: (x && x.sc) || {},
  lt: (x && x.lt) || {}
});
let S = norm(),
  edit = !GH,
  tok = "",
  sha = "",
  br = "main",
  ver = 0,
  pend = 0,
  chain = Promise.resolve(),
  ask = false;
try {
  tok = localStorage.getItem("cip26tok") || ""
} catch (e) {}
if (!GH) try {
  S = norm(JSON.parse(localStorage.getItem("cip26")))
} catch (e) {}
const note = t => {
  const n = document.getElementById("note");
  if (n) n.textContent = t
};
const gh = (p, o = {}) => fetch(API + p, {
  ...o,
  cache: "no-store",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: "Bearer " + tok
  }
});
async function pull(force) {
  const v = ver,
    was = JSON.stringify(S);
  let nw = null,
    ns = null;
  try {
    if (edit) {
      const r = await gh("/contents/" + FILE + "?ref=" + br);
      if (r.ok) {
        const j = await r.json();
        ns = j.sha;
        nw = JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\s/g, "")))))
      } else if (r.status === 404) {
        ns = "";
        nw = {}
      }
    } else {
      const r = await fetch(FILE + "?t=" + Date.now(), {
        cache: "no-store"
      });
      if (r.ok) nw = await r.json()
    }
  } catch (e) {}
  if (nw && v === ver && !pend) {
    S = norm(nw);
    if (ns !== null) sha = ns
  }
  if (force || JSON.stringify(S) !== was) render()
}

function save() {
  ver++;
  if (!GH) {
    try {
      localStorage.setItem("cip26", JSON.stringify(S))
    } catch (e) {}
    return
  }
  pend++;
  note("Saving...");
  chain = chain.then(async () => {
    if (--pend > 0) return;
    const body = {
      message: "Update results",
      content: btoa(unescape(encodeURIComponent(JSON.stringify(S, null, 1)))),
      branch: br
    };
    if (sha) body.sha = sha;
    let bad = "";
    try {
      const r = await gh("/contents/" + FILE, {
        method: "PUT",
        body: JSON.stringify(body)
      });
      if (r.ok) sha = (await r.json()).content.sha;
      else bad = r.status === 409 || r.status === 422 ? "Another organiser saved at the same moment. Showing the latest results; please redo your last change." : r.status === 401 || r.status === 403 || r.status === 404 ? "Not saved: your token cannot write to this repository." : "Not saved (GitHub error " + r.status + ").";
    } catch (e) {
      bad = "Not saved: no connection."
    }
    if (pend) return;
    if (bad) {
      note(bad);
      ver++;
      await pull(true)
    } else note("Saved. Players see it within about a minute.")
  })
}
async function signin(t, quiet) {
  tok = (t || "").trim();
  if (!tok) return;
  if (!quiet) note("Checking...");
  let ok = false,
    err = "That token does not have write access to this repository.";
  try {
    const r = await gh("");
    if (r.ok) {
      const j = await r.json();
      if (j.permissions && j.permissions.push) {
        ok = true;
        br = j.default_branch || br
      }
    }
  } catch (e) {
    err = "Could not reach GitHub. Try again."
  }
  if (ok) {
    edit = true;
    ask = false;
    try {
      localStorage.setItem("cip26tok", tok)
    } catch (e) {}
    note("Organiser mode is on.")
  } else {
    tok = "";
    if (!quiet || err[0] === "T") {
      try {
        localStorage.removeItem("cip26tok")
      } catch (e) {}
    }
    note(quiet ? "" : err)
  }
  foot();
  await pull(true)
}

function signout() {
  tok = "";
  edit = false;
  sha = "";
  try {
    localStorage.removeItem("cip26tok")
  } catch (e) {}
  note("");
  foot();
  pull(true)
}

function foot() {
  const f = document.getElementById("ft");
  f.innerHTML = '<p id="note" role="status" aria-live="polite">' + esc(document.getElementById("note") ? document.getElementById("note").textContent : "") + '</p>' + (
    !GH ? 'Local preview: results are saved in this browser only.' :
    edit ? 'Organiser mode: your changes are saved for everyone. <button data-a="out">Sign out</button>' :
    ask ? '<label for="tk">Paste your GitHub access token (needs write access to ' + esc(GH) + '). It stays in this browser.</label><br><input id="tk" type="password" autocomplete="off"><button data-a="tokok">Sign in</button> <button data-a="tokno">Cancel</button>' :
    'View only. Results are updated by the organisers. <button data-a="tok">Organiser sign-in</button>')
}
