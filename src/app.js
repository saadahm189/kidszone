// Importing modules:
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Importing DB connection:
const con = require("./db/conn");

// Initialize express:
const app = express();

// Used for fetching data from form:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Declaring server port:
const port = process.env.PORT || 8000;

// Rendering all HTML from public folder:
const static_path = path.join(__dirname, "../public"); // Changed root folder to public: now public = "/"
app.use(express.static(static_path));

// For inserting data from TEST INDEX FORM:----------------------------------------------------------------
app.post("/", function (req, res) {
    console.log(req.body);
    var fname = req.body.fname;
    var lname = req.body.lname;
    console.log(fname);
    console.log(lname);

    var sql = "INSERT INTO `test`(`fname`, `lname`) VALUES ('" + fname + "', '" + lname + "')";

    con.query(sql, function (error, result) {
        if (error) throw error;
        res.send("Success!");
        return res.redirect('/'); // Redirect to desired page:
    });
})
// For inserting data from LOGIN FORM:----------------------------------------------------------------
app.post("/home/adminLogin.html", function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);

    var sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';

    con.query(sql, [username, password], function (error, result) {
        if (error) throw error;
        // res.send("Success!");
        return res.redirect('/admin/index.html'); // Redirect to desired page:
    });
})
// For inserting data from TCONTACT US FORM:----------------------------------------------------------------
app.post("/home/about.html", function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var msg = req.body.msg;

    var sql = "INSERT INTO `contactus`(`name`, `email`, `phone`, `message`) VALUES ('" + name + "', '" + email + "','" + phone + "', '" + msg + "')";

    con.query(sql, function (error, result) {
        if (error) throw error;
        // res.send("Success!");
        return res.redirect('/home/about.html'); // Redirect to desired page:
    });
})
// Creating server at port 8000:
app.listen(port, () => {
    console.log("Server running PORT:8000");
})
module.exports = app