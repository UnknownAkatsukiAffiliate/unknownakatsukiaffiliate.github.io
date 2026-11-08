/**
 * Private dashboard for the Skills Directory sheet.
 *
 * Add this as a SECOND file in the Skills sheet's Apps Script project
 * (Files > + > Script > name it "Dashboard"), save, then choose
 * "buildDashboard" in the function dropdown and click Run.
 *
 * It creates a "Dashboard" tab with live formulas and charts. Only people the
 * spreadsheet is shared with can see it. Run it again any time to rebuild.
 * No new deployment is needed.
 */

var DASH_NAME = "Dashboard";
var DASH_GREEN = "#2c5530";

// Must match the lists on the website's Skills page
var DASH_CATEGORIES = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "Roofing", "Landscaping",
  "HVAC", "Welding", "Masonry", "Locksmith", "Automotive", "Appliance Repair",
  "General Maintenance", "Cleaning Services", "Security", "Other"
];
var DASH_EXPERIENCE = ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

function dashColLetter_(n) {
  var s = "";
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // The data tab is the first tab that isn't the dashboard
  var data = ss.getSheets().filter(function (s) { return s.getName() !== DASH_NAME; })[0];

  // If there are no sign-ups yet, (re)write the correct headings in row 1
  var DATA_HEADERS = ["name", "email", "phone", "skillCategories", "skills",
                      "experience", "address", "description", "dateSubmitted"];
  if (data.getLastRow() <= 1) {
    data.getRange(1, 1, 1, Math.max(data.getLastColumn(), 1)).clearContent();
    data.getRange(1, 1, 1, DATA_HEADERS.length).setValues([DATA_HEADERS]).setFontWeight("bold");
    data.setFrozenRows(1);
  }

  var headers = data.getRange(1, 1, 1, Math.max(data.getLastColumn(), 1)).getValues()[0]
    .map(function (h) { return String(h).trim(); });

  var sheetRef = "'" + data.getName().replace(/'/g, "''") + "'!";
  function col(name) {
    var i = headers.indexOf(name);
    if (i === -1) throw new Error('Row 1 of the "' + data.getName() + '" tab needs a "' + name + '" heading.');
    var L = dashColLetter_(i + 1);
    return sheetRef + L + "2:" + L;
  }
  var nameR = col("name"), phoneR = col("phone"), emailR = col("email"),
      catR = col("skillCategories"), expR = col("experience"), dateR = col("dateSubmitted");

  // Start fresh
  var old = ss.getSheetByName(DASH_NAME);
  if (old) ss.deleteSheet(old);
  var d = ss.insertSheet(DASH_NAME, ss.getSheets().length); // added as the LAST tab
  d.setHiddenGridlines(true);

  var widths = [190, 140, 230, 210, 130, 110];
  widths.forEach(function (w, i) { d.setColumnWidth(i + 1, w); });

  // Title
  d.getRange("A1").setValue("Skills Directory Dashboard")
    .setFontSize(20).setFontWeight("bold").setFontColor(DASH_GREEN);
  d.getRange("A2").setValue("Updates automatically when people sign up on the website. Private: only people this spreadsheet is shared with can see it.")
    .setFontColor("#6c757d").setFontStyle("italic");

  // Headline numbers
  var catTop = 8, catEnd = catTop + DASH_CATEGORIES.length - 1;
  var kpis = [
    ["A", "Total workers", "=COUNTA(" + nameR + ")"],
    ["C", "Categories in use", "=COUNTIF(B" + catTop + ":B" + catEnd + ",\">0\")"],
    ["D", "Most common category", "=IF(A5=0,\"-\",INDEX(A" + catTop + ":A" + catEnd + ",MATCH(MAX(B" + catTop + ":B" + catEnd + "),B" + catTop + ":B" + catEnd + ",0)))"]
  ];
  kpis.forEach(function (k) {
    d.getRange(k[0] + "4").setValue(k[1]).setFontColor("#6c757d").setFontWeight("bold");
    d.getRange(k[0] + "5").setFormula(k[2]).setFontSize(22).setFontWeight("bold")
      .setFontColor(DASH_GREEN).setHorizontalAlignment("left");
  });

  function headerRow(range, labels) {
    d.getRange(range).setValues([labels]).setFontWeight("bold")
      .setBackground(DASH_GREEN).setFontColor("#ffffff");
  }

  // Workers per category
  headerRow("A7:B7", ["Category", "Workers"]);
  d.getRange("A" + catTop + ":A" + catEnd).setValues(DASH_CATEGORIES.map(function (c) { return [c]; }));
  d.getRange("B" + catTop + ":B" + catEnd).setFormulas(DASH_CATEGORIES.map(function (c, i) {
    return ["=COUNTIF(" + catR + ",\"*\"&A" + (catTop + i) + "&\"*\")"];
  }));

  // Experience levels
  var expEnd = catTop + DASH_EXPERIENCE.length - 1;
  headerRow("D7:E7", ["Experience", "Workers"]);
  d.getRange("D" + catTop + ":D" + expEnd).setValues(DASH_EXPERIENCE.map(function (e) { return [e]; }));
  d.getRange("E" + catTop + ":E" + expEnd).setFormulas(DASH_EXPERIENCE.map(function (e, i) {
    return ["=COUNTIF(" + expR + ",D" + (catTop + i) + ")"];
  }));

  // Zebra striping for the two tables
  for (var r = catTop; r <= catEnd; r++) {
    if ((r - catTop) % 2 === 1) {
      d.getRange("A" + r + ":B" + r).setBackground("#f3f6f3");
      if (r <= expEnd) d.getRange("D" + r + ":E" + r).setBackground("#f3f6f3");
    }
  }

  // All sign-ups, newest first
  var listTitle = catEnd + 3;
  d.getRange("A" + listTitle).setValue("All sign-ups (newest first)")
    .setFontSize(14).setFontWeight("bold").setFontColor(DASH_GREEN);
  headerRow("A" + (listTitle + 1) + ":F" + (listTitle + 1),
    ["Name", "Phone", "Email", "Categories", "Experience", "Date submitted"]);
  d.getRange("A" + (listTitle + 2)).setFormula(
    "=IFERROR(SORT(FILTER(HSTACK(" + [nameR, phoneR, emailR, catR, expR, dateR].join(",") + ")," + nameR + "<>\"\")," +
    "FILTER(ROW(" + nameR + ")," + nameR + "<>\"\"),FALSE),\"No sign-ups yet\")"
  );

  // Charts
  d.insertChart(d.newChart().asBarChart()
    .addRange(d.getRange("A7:B" + catEnd))
    .setTitle("Workers per category")
    .setLegendPosition(Charts.Position.NONE)
    .setColors([DASH_GREEN])
    .setPosition(4, 8, 0, 0)
    .setOption("width", 520).setOption("height", 420)
    .build());

  d.insertChart(d.newChart().asPieChart()
    .addRange(d.getRange("D7:E" + expEnd))
    .setTitle("Experience levels")
    .setColors(["#2c5530", "#4a7c4f", "#76a67a", "#a7c9aa", "#d3e6d4"])
    .setPosition(27, 8, 0, 0)
    .setOption("width", 520).setOption("height", 320)
    .build());

  ss.setActiveSheet(d);
}
