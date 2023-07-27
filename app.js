const bodyParser = require("body-parser");
const express = require("express");
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database("./wallet.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error("db error === >", err);
});

app.use(bodyParser.json());

app.post("/quote", (req, res) => {
  try {
    console.log(req.body);
    return res.json({
      status: 200,
      success: true,
    });
  } catch (err) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.get("/quote", (req, res) => {
  sql = "SELECT * FROM Wallet";
  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.log("err===>", err);
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }
      if (rows.length < 1) {
        return res.json({ status: 300, success: false, error: "No Match" });
      }
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (err) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.listen(3000, () => {
  console.log("app running on port 3000 ");
});
