const m = "https://driftback.app", p = "http://localhost:3000", c = typeof window < "u" && window.location.hostname === "localhost" ? p : m, f = "/api/v1/surveys", d = 360, l = 0;
function h(n, r, a, o) {
  const i = `/${encodeURIComponent(n)}/surveys/${encodeURIComponent(r)}/embed`, e = new URL(window.location.href);
  e.search = "";
  const t = new URL(i, c);
  return t.searchParams.set("email", a), t.searchParams.set("metadata", JSON.stringify(o)), t.searchParams.set("url", e), t.toString();
}
function b(n, r) {
  const a = new URL(f, c), o = new URL(window.location.href);
  return o.search = "", a.searchParams.set("project_id", n), a.searchParams.set("email", r), a.searchParams.set("url", o), a.toString();
}
function g() {
  const n = (t) => {
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  }, r = document.currentScript || document.querySelector("script[data-driftback-project-id],script[data-driftback-email]"), a = { projectId: null, email: null, metadata: {} };
  if (!r) return a;
  const o = r.getAttribute("data-driftback-project-id"), i = r.getAttribute("data-driftback-email"), e = {};
  for (const t of Array.from(r.attributes)) {
    if (!t.name.startsWith("data-driftback-metadata-")) continue;
    const s = t.name.slice(24);
    e[s] = n(t.value);
  }
  return console.log(">>> metadata", e), { projectId: o, email: i, metadata: e };
}
async function y(n, r) {
  try {
    const a = b(n, r);
    return (await (await fetch(a)).json()).survey_ids[0] || null;
  } catch {
    return null;
  }
}
function w(n, r) {
  const i = (t) => {
    const s = Math.max(120, Math.min(t | 0, Math.floor(window.innerHeight * 0.9)));
    n.style.height = s + "px", r.style.height = "100%";
  };
  n.style.transition = "height 100ms ease";
  function e(t) {
    if (t.origin !== c) return;
    const s = t.data || {};
    if (s.type === "driftback:resize" && typeof s.height == "number" && i(s.height), s.type === "driftback:close") {
      n.remove();
      return;
    }
  }
  window.addEventListener("message", e);
}
function I(n, r, a, o) {
  if (document.getElementById("driftback-survey-root")) return;
  const i = document.createElement("div");
  i.id = "driftback-survey-root", Object.assign(i.style, {
    position: "fixed",
    inset: "auto 16px 16px auto",
    // bottom-right
    width: `${d}px`,
    height: `${l}px`,
    // will be updated by resize messages
    zIndex: 5e4,
    boxShadow: "rgba(0,0,0,0.2) 0 18px 50px -10px",
    borderRadius: "16px"
  });
  const e = document.createElement("iframe");
  e.title = "Survey", e.src = h(n, r, a, o), e.width = String(d), e.height = String(l), e.allow = "clipboard-write;", Object.assign(e.style, {
    border: "none",
    width: "100%",
    height: "100%",
    display: "block"
  });
  const t = document.createElement("button");
  t.type = "button", t.setAttribute("aria-label", "Dismiss survey"), t.textContent = "×", Object.assign(t.style, {
    position: "absolute",
    top: "6px",
    right: "10px",
    fontSize: "24px",
    lineHeight: "1",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#a8a29e",
    // text-stone-400
    zIndex: 2
  }), t.addEventListener("click", () => {
    console.log(">>> sending close message of driftback:dismiss"), e.contentWindow.postMessage({ type: "driftback:dismiss" }, c), setTimeout(() => i.remove(), 150);
  }, { passive: !0 }), i.appendChild(e), i.appendChild(t), document.body.appendChild(i), w(i, e);
}
async function u() {
  const { projectId: n, email: r, metadata: a } = g();
  if (!n) return;
  console.log(">>> projectId: ", n);
  const o = await y(n, r);
  o && (console.log(">>> surveyId: ", o), I(n, o, r, a));
}
typeof window < "u" && (window.DriftbackSurvey = Object.assign(window.DriftbackSurvey || {}, { mount: u }));
u();
console.log("mounted");
export {
  u as mount
};
