const fs = require("fs");

const schema = fs.readFileSync("./notes_structure.sql", "utf8");
console.log(schema);
