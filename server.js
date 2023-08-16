const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
dotenv.config({ path: "./.env" });

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json());
connectDB(); // Connect to databse

// API Routes
app.use(cors({
  origin: "*",
  headers: ["Content-Type"],
  credentials: true,
}));
app.use(cors({
  origin: "*",
  headers: {
      "Access-Control-Allow-Origin": "*", // incorrect
      "Access-Control-Allow-Credentials": true // incorrect
  },
}));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/upload", require("./routes/upload"));


// --------------------------DEPLOYMENT------------------------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    return res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// --------------------------DEPLOYMENT------------------------------

// Error Handler Middleware (Should be at the end of all middlewares)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`)
);

// Handling server errors with clean error messages
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
