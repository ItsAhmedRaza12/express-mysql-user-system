const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "delta_app",
});
let getRandomUser = () => {
  return [
    faker.string.uuid(), // OK in v9
    faker.internet.username(), // new name!
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("showuser", { user: result });
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});
//edit
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

//update
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong!!");
        return;
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result2) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});
//delete
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});
//new
app.get("/user/new", (req, res) => {
  res.render("new");
});
app.post("/user", (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();
  let q = `INSERT INTO user(id,username,email,password) VALUES('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

//try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }
// connection.end();
// let q = "INSERT INTO user(id,username,email,password) VALUES ?";
// let data = [];
// for (let i = 0; i <= 100; i++) {
//   data.push(getRandomUser());
// }
//
