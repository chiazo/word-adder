const GoogleSpreadsheet = require("google-spreadsheet");
const cred = require("./client_secret.json");

let doc = new GoogleSpreadsheet(cred.spread_id)
doc.useServiceAccountAuth(cred, function(e) {
    doc.getRows(1, function(e, rows) {
        console.log(rows.length);
    });
});