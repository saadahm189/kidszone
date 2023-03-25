// Importing Modules:
var mysql = require('mysql');
// Connecting Database:
var con = mysql.createConnection({
    host: "localhost",
    user: "saad",
    password: "ahmed",
    database: "kidszone"
});
con.connect((err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Database connected')
  })
// // Fech data from DB
// con.query("SELECT * FROM test", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
// });
// // Insert data into DB
// var fname = 'mithy';
// var lname = 'rupa';
// // var sql = "INSERT INTO `test`(`fname`, `lname`) VALUES (?,?)"; // add [fname,lname] after sql,
// var sql = "INSERT INTO `test`(`fname`, `lname`) VALUES ('" + fname + "', '" + lname + "')";

// con.query(sql, function (error, result) {
//     if (error) throw error;
//     console.log("Success!");
// });

module.exports = con;