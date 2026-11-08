# Google Sheets setup (replaces SheetDB)

The website saves form data to Google Sheets using a small Google Apps Script.
It's free, and the same script ([Code.gs](Code.gs)) is used for all three sheets.
Only the **SETTINGS** at the top change.

| Sheet | `ALLOW_READ` | `HEADERS` | URL goes in `SHEETS.` |
|---|---|---|---|
| Individual registrations | `false` | `[]` (keeps your existing columns) | `individual` |
| Business registrations | `false` | `[]` (keeps your existing columns) | `business` |
| Skills directory | `true` | see below | `skills` |

The URLs go in [client/src/config/sheets.js](../client/src/config/sheets.js).

## Steps (repeat for each sheet, ~5 minutes each)

1. Open the Google Sheet.
   - **Registrations:** use the sheets SheetDB is already connected to. Your columns and existing rows stay as they are.
   - **Skills:** create a new blank Google Sheet, for example "CID Skills Directory".
2. Click **Extensions → Apps Script**.
3. Delete what's in the editor, paste in all of [Code.gs](Code.gs), and change the **SETTINGS** for that sheet (see the table above).
4. Click **Save** (the disk icon).
5. **Skills sheet only:** select `setupHeaders` in the function dropdown at the top and click **Run**.
   Allow access when Google asks. Row 1 now has the column names.
6. Click **Deploy → New deployment**, then the gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and allow access (if Google shows "unsafe app", click **Advanced → Go to project**; it's your own script).
7. Copy the **Web app URL** (ends in `/exec`) into `client/src/config/sheets.js`.

### Skills sheet settings

```js
var ALLOW_READ = true;
var SHEET_NAME = "";
var HEADERS = ["name", "email", "phone", "skillCategories", "skills",
               "experience", "address", "description", "dateSubmitted"];
```

## Changing the script later

After editing the code, go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
That keeps the same URL. Choosing "New deployment" again creates a **new URL** instead.

## Notes

- Registration sheets are **write-only**: opening the URL in a browser only shows
  `"Reading is disabled for this sheet."`, so nobody can download members' personal details.
- Column names must match exactly (including capitals and spaces). If the website sends
  a field that has no matching column, the submission is refused and the sheet is left unchanged.
- Values are saved as plain text, so ID numbers keep their leading zeros and phone numbers like `+27…` aren't changed.
