// Lightweight survey loader – no framework dependencies.

import {
  DRIFTBACK_ORIGIN,
  DEFAULT_IFRAME_HEIGHT,
  DEFAULT_IFRAME_WIDTH,
  buildEmbedUrl,
  buildSurveysApiUrl,
} from "./config.js";

function getParamsFromCurrentScript() {
  const parse = (v) => { try { return JSON.parse(v); } catch { return v; } }
  // Prefer currentScript when available (classic scripts). For ES modules it may be null,
  // so fall back to locating the loader by its data attributes, then by known src suffixes.
  const scriptEl = document.currentScript || document.querySelector('script[data-driftback-project-id],script[data-driftback-email]')
  const empty = { projectId: null, email: null, metadata: {} };

  if (!scriptEl) return empty;

  const projectId = scriptEl.getAttribute('data-driftback-project-id')
  const email = scriptEl.getAttribute('data-driftback-email')
  const metadata = {};

  for (const attr of Array.from(scriptEl.attributes)) {
    if (!attr.name.startsWith('data-driftback-metadata-')) continue;
    const key = attr.name.slice('data-driftback-metadata-'.length);
    metadata[key] = parse(attr.value)
  }

  console.log(">>> metadata", metadata)

  return { projectId, email, metadata };
}

async function fetchFirstPendingSurveyId(projectId, email) {
  try {
    const url = buildSurveysApiUrl(projectId, email);
    const res = await fetch(url);
    const data = await res.json();

    let ids = data.survey_ids;
    return ids[0] || null;
  } catch {
    return null;
  }
}

function installResizeBridge(root, iframe) {
  const MIN_H = 120;
  const MAX_VH = 0.9; // cap to 90% of viewport
  const setHeight = (h) => {
    const clamped = Math.max(MIN_H, Math.min(h | 0, Math.floor(window.innerHeight * MAX_VH)));
    root.style.height = clamped + "px";
    iframe.style.height = "100%";
  };

  // optional: smoothen height changes
  root.style.transition = "height 100ms ease";

  function onMessage(e) {
    if (e.origin !== DRIFTBACK_ORIGIN) return;

    const d = e.data || {};
    if (d.type === "driftback:resize" && typeof d.height === "number") {
      setHeight(d.height);
    }

    if (d.type === "driftback:close") {
      root.remove();
      return;
    }
  }

  window.addEventListener("message", onMessage);
}

function renderSurveyIframe(projectId, surveyId, email, metadata) {
  if (document.getElementById("driftback-survey-root")) return;

  const root = document.createElement("div");
  root.id = "driftback-survey-root";
  Object.assign(root.style, {
    position: "fixed",
    inset: "auto 16px 16px auto", // bottom-right
    width: `${DEFAULT_IFRAME_WIDTH}px`,
    height: `${DEFAULT_IFRAME_HEIGHT}px`, // will be updated by resize messages
    zIndex: 50000,
    boxShadow: "rgba(0,0,0,0.2) 0 18px 50px -10px",
    borderRadius: "16px",
  });

  const iframe = document.createElement("iframe");
  iframe.title = "Survey";
  iframe.src = buildEmbedUrl(projectId, surveyId, email, metadata);
  iframe.width = String(DEFAULT_IFRAME_WIDTH);
  iframe.height = String(DEFAULT_IFRAME_HEIGHT);
  iframe.allow = "clipboard-write;";
  // iframe.referrerPolicy = "unsafe-url";
  Object.assign(iframe.style, {
    border: "none",
    width: "100%",
    height: "100%",
    display: "block",
  });

  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss survey");
  close.textContent = "×";
  Object.assign(close.style, {
    position: "absolute",
    top: "6px",
    right: "10px",
    fontSize: "24px",
    lineHeight: "1",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#a8a29e", // text-stone-400
    zIndex: 2,
  });
  close.addEventListener("click", () => {
    console.log(">>> sending close message of driftback:dismiss")
    // Ask the iframe (same origin as DRIFTBACK_ORIGIN) to mark the response dismissed
    iframe.contentWindow.postMessage({ type: "driftback:dismiss" }, DRIFTBACK_ORIGIN);
    setTimeout(() => root.remove(), 150); // wait a little for backend to receive the remove message
  }, { passive: true });



  root.appendChild(iframe);
  root.appendChild(close);
  document.body.appendChild(root);

  installResizeBridge(root, iframe);
}

export async function mount() {
  const { projectId, email, metadata } = getParamsFromCurrentScript();
  if (!projectId) return; console.log(">>> projectId: ", projectId)

  const surveyId = await fetchFirstPendingSurveyId(projectId, email);
  if (!surveyId) return; console.log(">>> surveyId: ", surveyId)

  renderSurveyIframe(projectId, surveyId, email, metadata);
}

if (typeof window !== "undefined") {
  window.DriftbackSurvey = Object.assign(window.DriftbackSurvey || {}, { mount });
}

mount();
console.log("mounted")
