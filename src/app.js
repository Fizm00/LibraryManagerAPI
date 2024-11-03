const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const connectDB = require("./config/mongodb");
const logger = require("./middleware/logger");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
