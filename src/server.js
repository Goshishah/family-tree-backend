require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

//application routing
app.use(routes);
app.listen(port, (err) => {
  if (err) console.error("❌ Unable to connect the server: ", err);
  console.log(`Application is listening at http://localhost:${port}`);
});
