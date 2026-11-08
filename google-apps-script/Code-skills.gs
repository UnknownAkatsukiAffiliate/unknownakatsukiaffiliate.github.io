/**
 * Google Sheets API for the Cachet Park CID website (free replacement for SheetDB).
 *
 * Use the SAME script for every sheet; only change the SETTINGS below.
 * Paste into the Google Sheet via Extensions > Apps Script, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Works like SheetDB:
 *   POST { "data": { "Column Name": "value", ... } }  -> adds one row
 *   GET                                              -> [ { "Column Name": "value", ... }, ... ]
 */

// ===================== SETTINGS (change per sheet) =====================

// true  = the website may READ all rows (Skills directory needs this).
// false = write-only; nobody can read the data through the URL (use for registrations!).
var ALLOW_READ = true;

// Name of the tab to use. Leave "" to use the first tab.
var SHEET_NAME = "";

// Column headers for row 1. Only used by setupHeaders() and when the sheet is empty.
// Leave [] for sheets that already have their headers.
var HEADERS = ["name", "email", "phone", "skillCategories", "skills", "experience", "address", "description", "dateSubmitted"];

// ======================================================================

var MAX_FIELD_LENGTH = 2000; // longest value accepted per field

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim(); });
}

/** Run once from the editor (select "setupHeaders" > Run) to write the HEADERS into row 1. */
function setupHeaders() {
  var sheet = getSheet_();
  if (!HEADERS.length) throw new Error("HEADERS is empty - nothing to set up.");
  if (getHeaders_(sheet).filter(String).length) {
    throw new Error("Row 1 already has headers - leaving them unchanged.");
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// GET: return all rows as objects (only if ALLOW_READ is true)
function doGet() {
  if (!ALLOW_READ) return json_({ error: "Reading is disabled for this sheet." });

  var sheet = getSheet_();
  var headers = getHeaders_(sheet);
  if (sheet.getLastRow() < 2 || !headers.length) return json_([]);

  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getDisplayValues();
  var result = rows
    .filter(function (row) { return row.some(function (v) { return v !== ""; }); })
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) { if (h) obj[h] = row[i]; });
      return obj;
    });
  return json_(result);
}

// POST: add one row, matching fields to columns by header name
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var data = body.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return json_({ error: "Expected { data: { ... } }" });
    }

    var sheet = getSheet_();
    var headers = getHeaders_(sheet).filter(String);

    // Empty sheet: create headers (from HEADERS, or from the submitted fields)
    if (!headers.length) {
      headers = HEADERS.length ? HEADERS.slice() : Object.keys(data);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Refuse fields that don't match this sheet's columns, so the sheet is never changed
    // (e.g. if the wrong form is pointed at this sheet).
    var unknown = Object.keys(data).filter(function (key) { return headers.indexOf(key) === -1; });
    if (unknown.length) {
      return json_({ error: "These fields have no matching column in this sheet: " + unknown.join(", ") });
    }

    var row = headers.map(function (h) {
      var value = data[h];
      if (value === undefined || value === null) return "";
      value = String(value).slice(0, MAX_FIELD_LENGTH);
      // Leading ' keeps values as plain text: ID numbers keep leading zeros,
      // "+27..." phone numbers aren't treated as formulas, and "=..." can't run as a formula.
      return value === "" ? "" : "'" + value;
    });

    sheet.appendRow(row);
    return json_({ created: 1 });
  } catch (err) {
    return json_({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
