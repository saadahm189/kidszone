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

// -----------------------------------------EJS------------------------------------------------------------
// Changed default "view" path of ejs file to desired location:
const dyn_path = path.join(__dirname, "../public"); // Changed root folder to public: now public = "/"
app.set('view engine', 'ejs');
app.set("views", dyn_path);

// Rendering .ejs files one by one:
app.get("/", (req, res,) => {

    con.query("SELECT * FROM contactus", (err, result) => {
        if (err) throw err;
        res.render('index', { data: result });
    });

});
app.get("/home/index", (req, res,) => {
    res.render('home/index');

});
app.get("/home/lesson", (req, res,) => {
    res.render('home/lesson');

});
app.get("/home/about", (req, res,) => {
    res.render('home/about');

});
app.get("/home/games", (req, res,) => {
    res.render('home/games');

});
app.get("/home/books", (req, res,) => {
    res.render('home/books');

});
app.get("/home/adminLogin", (req, res,) => {
    res.render('home/adminLogin');

});
app.get("/admin/index", (req, res,) => {
    res.render('admin/index');

});
// ---------------------------------------------END EJS--------------------------------------------------------

// Rendering all STATIC HTML from public folder: now used for CSS render as HTML changes to EJS
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
app.post("/home/adminLogin", function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);

    var sql = 'SELECT * FROM admin WHERE username = ? ';

    con.query(sql, [username], function (error, data) {
        if (error) throw error;
        console.log(data);
        if (data[0].username == username && data[0].password == password) {
            return res.redirect('/admin/index'); // Redirect to desired page:
        } else {
            return res.redirect('/home/adminLogin'); // Redirect to desired page:
        }
    });
})
// For inserting data from TCONTACT US FORM:----------------------------------------------------------------
app.post("/home/about", function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var msg = req.body.msg;

    var sql = "INSERT INTO `contactus`(`name`, `email`, `phone`, `message`) VALUES ('" + name + "', '" + email + "','" + phone + "', '" + msg + "')";

    con.query(sql, function (error, result) {
        if (error) throw error;
        // res.send("Success!");
        return res.redirect('/home/about'); // Redirect to desired page:
    });
})
// Creating server at port 8000:
app.listen(port, () => {
    console.log("Server running PORT:8000");
})
module.exports = app