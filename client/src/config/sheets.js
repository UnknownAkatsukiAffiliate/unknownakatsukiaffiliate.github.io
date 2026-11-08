// Google Apps Script web app URLs (free replacement for SheetDB).
// Paste each deployment URL here; it looks like
// https://script.google.com/macros/s/XXXXXXXX/exec
// See google-apps-script/README.md for setup steps.
export const SHEETS = {
  individual: "https://script.google.com/macros/s/AKfycbziylNfJ5nh18EBJe1fpLGExknO0YGxHre_svc90hLJbsVLb2U2UX_oSd7t-wVBz-T1/exec",
  business: "https://script.google.com/macros/s/AKfycbzp_TCy8Kz9Au4H3UciP1PUtic4te6YRWfhBlyePepbjKDTM_rfhjUDqrf9MZ9BT5ak/exec",
  skills: "https://script.google.com/macros/s/AKfycbz-hAvYIBEddCg-X4FbBeJSEmcAYvZiubrQaP5AW8IfwR0utcyrj8RP2RW_jttkgIFXtQ/exec",
};

// Add one row. Sent as text/plain because Google Apps Script can't
// handle the extra "preflight" request browsers make for JSON.
export async function addRow(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ data }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error || "Submission failed");
  return json;
}

// Read all rows (only works for sheets with ALLOW_READ = true).
export async function getRows(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || !Array.isArray(json)) throw new Error(json?.error || "Could not load data");
  return json;
}
