const bodyParser = require("body-parser");
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
