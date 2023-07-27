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

app.get("/wallet/all", (req, res) => {
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
app.get("/customer/:transaction_id", (req, res) => {
  const transaction_id = req.params.transaction_id;
  sql = `SELECT st.transaction_id, st.created_date, st.total_cost, si.wallet_id
    FROM SalesTransaction st
    JOIN SalesTransaction_Item si ON st.transaction_id = si.transaction_id
    WHERE st.customer_id = ${transaction_id};`;
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

app.get("/materal", (req, res) => {
  sql = `SELECT li.leather_id, li.leather_name, COUNT(sti.transaction_id) AS transaction_count
  FROM SalesTransaction_Item sti
  JOIN Wallet wi ON sti.wallet_id = wi.wallet_id
  JOIN Wallet_Leather wil ON wi.wallet_id = wil.wallet_id
  JOIN Leather li ON wil.leather_id = li.leather_id
  GROUP BY li.leather_id, li.leather_name
  ORDER BY transaction_count DESC
  LIMIT 1;  
    `;
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
//Retrieve the names of designers and their corresponding collections:
app.get("/designer", (req, res) => {
  sql = `SELECT Designer.designer_name, Collection.collection_name
  FROM Designer
  JOIN Collection ON Designer.designer_id = Collection.collection_id;  
      `;
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
//Retrieve all customers  credit card types count :
app.get("/customer/card-type/count", (req, res) => {
  sql = `SELECT credit_card_type, COUNT(*) AS count
  FROM Customer
  GROUP BY credit_card_type; 
        `;
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
//Retrieve the total cost of each sales transaction along with the customer's name:
app.get("/customer/:id/transaction", (req, res) => {
  const customer_id = req.params.id;
  sql = `SELECT SalesTransaction.total_cost, Customer.name
    FROM SalesTransaction
    JOIN Customer ON SalesTransaction.customer_id = ${customer_id}; `;
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
//Retrieve the collection name and the number of wallets in each collection:
app.get("/collection/sales", (req, res) => {
  sql = `SELECT Collection.collection_name, COUNT(Wallet.collection_id) AS wallet_count
    FROM Collection
    LEFT JOIN Wallet ON Collection.collection_id = Wallet.collection_id
    GROUP BY Collection.collection_name; `;
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
//Retrieve the store country and the number of sales transactions for each store:
app.get("/country/sales", (req, res) => {
  sql = `SELECT Store.country, COUNT(SalesTransaction.store_id) AS transaction_count
    FROM Store
    LEFT JOIN SalesTransaction ON Store.store_id = SalesTransaction.store_id
    GROUP BY Store.country;`;
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
//Retrieve the supplier names and the total quantity of raw materials supplied by each supplier:
app.get("/supplier", (req, res) => {
  sql = `SELECT Supplier.supplier_name, SUM(Raw_Material.quantity) AS total_quantity
  FROM Supplier
  JOIN Raw_Material ON Supplier.supplier_id = Raw_Material.supplier_id
  GROUP BY Supplier.supplier_name;`;
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

app.get("/cutomer/transation", (req, res) => {
  sql = `SELECT Customer.name, SalesTransaction.created_date, SalesTransaction.total_cost
    FROM Customer
    JOIN SalesTransaction ON Customer.customer_id = SalesTransaction.customer_id
   ;`;
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
