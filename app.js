
// LocaleEditorApp/app.js
//
// *********************************************
//  REMEMBER!
//
//  You need to set the folder path to your
//  "locales" folder in the index.js -file.
// *********************************************

const express = require("express");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", indexRouter);
app.listen(3000, () => {
  console.log("Open LocaleEditor in a browser: http://localhost:3000");
});
