const express = require("express");
const path = require("path");

const app = express();
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

app.use(express.static(path.join(__dirname, "public")));

app.use("/post", (req, res, next) => {
  console.log("I am post middleware");
  next();
});

app.use(postRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  console.log("I am middleware two");
  next();
});

app.listen(8080);
