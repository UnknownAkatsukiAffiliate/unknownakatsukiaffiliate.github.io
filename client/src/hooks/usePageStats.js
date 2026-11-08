import { useEffect, useState } from "react";

// Free, no-signup public counter service (https://abacus.jasoncameron.dev).
// Counters are created automatically the first time they are "hit".
const API = "https://abacus.jasoncameron.dev";
const NAMESPACE = "cachetpark-cid";

// Date in South African time so "today" rolls over at local midnight.
function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(new Date());
}

function safeGet(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}
function safeSet(storage, key, value) {
  try { storage.setItem(key, value); } catch { /* storage blocked */ }
}

async function counter(key, increment) {
  const res = await fetch(`${API}/${increment ? "hit" : "get"}/${NAMESPACE}/${key}`);
  if (res.status === 404) return 0; // counter not created yet
  if (!res.ok) throw new Error(`Counter request failed: ${res.status}`);
  const data = await res.json();
  return data.value ?? 0;
}

// Cache per page so React StrictMode / re-mounts don't double count.
const inFlight = {};

function loadStats(page) {
  if (inFlight[page]) return inFlight[page];

  const visitsKey = `${page}-visits`;
  const uniqueKey = `${page}-unique`;
  const dayKey = `${page}-day-${todayKey()}`;

  // A "visit" = once per browser tab session; "unique" = once per browser ever.
  const newSession = !safeGet(sessionStorage, `stats:${visitsKey}`);
  const newVisitor = !safeGet(localStorage, `stats:${uniqueKey}`);
  if (newSession) safeSet(sessionStorage, `stats:${visitsKey}`, "1");
  if (newVisitor) safeSet(localStorage, `stats:${uniqueKey}`, "1");

  inFlight[page] = Promise.all([
    counter(visitsKey, newSession),
    counter(uniqueKey, newVisitor),
    counter(dayKey, newSession),
  ]).then(([totalVisits, uniqueVisitors, visitsToday]) => ({
    totalVisits,
    uniqueVisitors,
    visitsToday,
  }));

  // Allow a retry on a later mount if the request failed.
  inFlight[page].catch(() => { delete inFlight[page]; });
  return inFlight[page];
}

export default function usePageStats(page) {
  const [state, setState] = useState({ status: "loading", stats: null });

  useEffect(() => {
    let active = true;
    loadStats(page)
      .then((stats) => active && setState({ status: "ready", stats }))
      .catch(() => active && setState({ status: "error", stats: null }));
    return () => { active = false; };
  }, [page]);

  return state;
}
