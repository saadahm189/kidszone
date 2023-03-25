// Importing modules:
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8000;
// Rendering all HTML from public folder:
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
// Creating server at port 8000:
app.listen(port, () => {
    console.log("Server running PORT:8000");
})