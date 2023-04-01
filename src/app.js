// Importing modules:
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");

// Importing DB connection:
const con = require("./db/conn");

// Initialize express:
const app = express();

// Used for fetching data from form:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Declaring server port:
const port = process.env.PORT || 8000;


// File upload +++++++++++++++++++++++++++++++++++++++++++++++++++
// Setting path for multer:
//const mul_path = path.join(__dirname, "../public/uploads/");

// Chnaging file name after uploading:
const sotage = multer.diskStorage({
    // Normally multer er path na die modify kore dicci:
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname)
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLocaleLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now();
        cb(null, fileName + fileExt);
    },
});

// For uploading file:
// const upload = multer({
//     // dest:"public/uploads", // default multer path without modify public/saad
//     storage: sotage,
//     limits: {
//         fileSize: 10000000 // 10 mb
//     },
//     fileFilter: (req, file, cb) => {
//         console.log(file);
//         if (file.mimetype == "application/pdf") {
//             cb(null, true);   // Condition match korle call back die no error and true send korbe browser e:
//         }
//         else {
//             cb(new Error("Only PDF is allowed")); // Error ta niche  handle hobe 
//         }
//     }
// })
// // For uploading multiple file:
const upload = multer({
    // dest:"public/uploads", // default multer path without modify public/saad
    storage: sotage,
    limits: {
        fileSize: 10000000 // 10 mb
    },
    fileFilter: (req, file, cb) => {
        console.log(file);
        if (file.fieldname == "book") {
            if (file.mimetype == "application/pdf") {
                cb(null, true);   // Condition match korle call back die no error and true send korbe browser e:
            }
            else {
                cb(new Error("Only PDF is allowed")); // Error ta niche  handle hobe 
            }
        } else if (file.fieldname == "cover") {
            if (file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg"
            ) {
                cb(null, true);   // Condition match korle call back die no error and true send korbe browser e:
            }
            else {
                cb(new Error("Only JPG is allowed")); // Error ta niche  handle hobe 
            }
        }
        else {
            cb(new Error("Only JPG is allowed"));
        }
    }
})

// -----------------------------------------Show EJS files Render------------------------------------------------------------
// Changed default "view" path of ejs file to desired location:
const dyn_path = path.join(__dirname, "../public"); // Changed root folder to public: now public = "/"
app.set('view engine', 'ejs');
app.set("views", dyn_path);

// Get means browser Render means local files in public:
// " " in get means localhost:8000. Now it is test file:
// Change "/home/index" to "/":
// Rendering .ejs files one by one:
app.get("/", (req, res,) => {

    con.query("SELECT * FROM test", (err, result) => {
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
    // res.render('home/books');
    // Shows book orifinal names from database: 
    con.query("SELECT * FROM books", (err, result) => {
        if (err) throw err;
        res.render('home/books', { data: result });
    });

});
app.get("/home/adminLogin", (req, res,) => {
    res.render('home/adminLogin');

});
app.get("/admin/index", (req, res,) => {
    let count;
    let count2;
    var sql = "SELECT COUNT(sn) AS sn_total FROM contactus;";
    var sql2 = "SELECT COUNT(sn) AS sn_total2 FROM admin;";

    con.query(sql, function (error, result) {
        if (error) throw error;
        count = result[0].sn_total;
        // res.render('admin/index', { count: count });
        con.query(sql2, function (error, result2) {
            if (error) throw error;
            count2 = result2[0].sn_total2;
            // res.render('admin/index', { count2: count2 });
            res.render('admin/index', { count: count, count2: count2 });
        });
    });

});
app.get("/admin/contact", (req, res,) => {
    con.query("SELECT * FROM contactus", (err, result) => {
        if (err) throw err;
        res.render('admin/contact', { data: result });
    });
});
app.get("/delete/:id", (req, res,) => {
    var id = req.params.id;
    console.log(id);
    con.query("DELETE FROM contactus WHERE sn = '" + id + "'", (err, result) => {
        if (err) throw err;

    });
});
app.get("/admin/bookUpload", (req, res,) => {
    // Shows book orifinal names from database: 
    con.query("SELECT * FROM books", (err, result) => {
        if (err) throw err;
        res.render('admin/bookUpload', { data: result });
    });

});
// Butoon press korar pore ekhane jaia hello print korbe:
// Icca korle bookUpload page ei redirect kora jabe just test kete die bookUpload render kora lagbe and form thekeo:
// app.post("/admin/bookUpload", upload.single("book"),(req, res, next) => {

//     // res.send("File uploaded");
//     console.log(req.file);
//     var name = req.file.originalname;
//     var filename = req.file.filename;
//     console.log(filename);
//     con.query("INSERT INTO `books`(`name`,`original_name`) VALUES ('" + name + "','" + filename + "')", (err, result) => {
//         if (err) throw err;
//         return res.redirect('/admin/bookUpload');
//     });
// });
// // For uploading mutiple files at one:
app.post("/admin/bookUpload", upload.fields([
    { name: "book", maxCount: 1 },
    { name: "cover", maxCount: 1 },]
), (req, res, next) => {

    var bookname = req.files['book'][0].originalname;
    var bookfilename = req.files['book'][0].filename;
    var covername = req.files['cover'][0].originalname;
    var coverfilename = req.files['cover'][0].filename;
    console.log(bookfilename);
    console.log(coverfilename);
    con.query("INSERT INTO `books`(`name`,`original_name`,`cover`,`original_cover`) VALUES ('" + bookname + "','" + bookfilename + "','" + covername + "','" + coverfilename + "')", (err, result) => {
        if (err) throw err;
        return res.redirect('/admin/bookUpload');
    });
});
app.get("/games/letter", (req, res,) => {

    res.render('games/letter');
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

    var sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';

    con.query(sql, [username, password], function (error, data) {
        if (error) throw error;
        console.log(data);
        if (data.length > 0) {
            console.log("lenght");
            return res.redirect('/admin/index'); // Redirect to desired page:
        } else {
            return res.redirect('/home/adminLogin');
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
// Default error handler:
// Receive error from any code above and display eror message 
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {

            res.status(500).send('Upload erorr!');
        }
        else {

            res.status(500).send(err.message);
        }
    }
    else {
        res.send("Success");
    }
})
// Creating server at port 8000:
app.listen(port, () => {
    console.log("Server running PORT:8000");
})
module.exports = app