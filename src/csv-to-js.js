// csv-to-js.js
const fs = require("fs");
const Papa = require("papaparse");

const csv = fs.readFileSync("places.csv", "utf8");
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true,  dynamicTyping: true});
const js = "export const places = " + JSON.stringify(parsed.data, null, 2) + ";\n";

fs.writeFileSync("places.js", js);
console.log("Generated places.js");
