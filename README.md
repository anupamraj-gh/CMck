# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Updating site content without redeploying

The app can load its content from Google Sheets at runtime. The bundled
`src/config/content.json` remains the fallback if the remote endpoint is not
configured or cannot be reached. Open tabs check the sheet about once a minute
and re-render when valid content changes.

### Prepare the sheet

1. Use the spreadsheet you shared:
   [Open the content spreadsheet](https://docs.google.com/spreadsheets/d/1RXCpzHV19EC34HOLoMGnCUVRfmPYZK0eUDREpaeRvtU/edit).
   Run `node scripts/google-apps-script/export-content.mjs`. This generates
   `scripts/google-apps-script/generated/config.csv` and `products.csv` from
   `src/config/content.json`.
2. Import the CSVs into separate tabs named exactly `config` and `products`.
   Keep their headers and `json_value` cells intact. The values in those cells
   are JSON; edit the relevant JSON value when changing content. Importing the
   CSVs replaces the selected tab's contents, so preserve any existing data
   you need before importing.
3. In the spreadsheet, choose **Extensions → Apps Script** and replace the
   editor contents with `scripts/google-apps-script/Code.gs`.
4. The Apps Script template is preconfigured with this spreadsheet ID. If you
   set the optional `SPREADSHEET_ID` script property, its value overrides the
   default.
5. Choose **Deploy → New deployment → Web app**. Set **Execute as** to yourself
   and access to **Anyone**, then deploy, authorize, and copy the web app URL.
   The endpoint is publicly readable, so only put public website content in
   this sheet; keep the spreadsheet itself private.

   ### Google Maps API key

   The location picker reads `VITE_GOOGLE_MAPS_API_KEY` and falls back to Leaflet
   when the key is not configured. For local development, put the key in the
   ignored `.env.local` file. For GitHub Pages, add a repository Actions secret
   named `VITE_GOOGLE_MAPS_API_KEY`; the deploy workflow passes it to the build.

   The key is included in browser JavaScript, so enable Maps JavaScript API and
   Places API (New) in the same Google Cloud project, then restrict the key to
   those APIs and your website referrers, including
   `http://localhost:5173/*` for local development. Places API (New) powers
   place-name suggestions when Google Maps is active; Photon/OpenStreetMap
   remains the search provider when the map falls back to Leaflet. Do not commit
   the key.

### Connect the app

Set `VITE_CONTENT_URL` to the copied web app URL in local `.env.local`. The
GitHub Pages workflow also supplies this URL during production builds:

```env
VITE_CONTENT_URL=https://script.google.com/macros/s/AKfycbwAMioSYvyC1TCaaehRdKNEXujOA_8FWf0p2ZY1AkuYPy3WSjPKmG5lmrlVqPzSVv51/exec
```

Restart the local Vite server and deploy the app once with this setting. After
that initial deployment, update the sheet directly; existing open tabs will
pick up valid changes within about a minute. If the sheet is malformed or
unavailable, the app logs a warning and continues using its last valid content
(or the bundled JSON if it has not loaded remote content yet).
