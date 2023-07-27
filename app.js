const bodyParser = require("body-parser");
const express = require("express");
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const cors = require("cors");
const db = new sqlite.Database("./wallet.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error("db error === >", err);
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};
app.use(allowCrossDomain);
//https://3lm9vz.csb.app/
//https://codesandbox.io/s/divine-pine-3lm9vz?file=/src/server.js
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

app.get("/wallet/:id", (req, res) => {
  const wallet_id = req.params.id;
  sql = `SELECT Wallet.product_number, Wallet.color, Wallet.material, Wallet.price
    FROM SalesTransaction_Item
    JOIN Wallet ON SalesTransaction_Item.Wallet_id = Wallet.Wallet_id
    WHERE SalesTransaction_Item.transaction_id = ${wallet_id};`;
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
