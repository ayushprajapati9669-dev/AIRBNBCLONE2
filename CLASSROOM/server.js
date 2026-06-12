const express = require("express");
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const app = express();
app.use("/users", users);
app.use("/posts", posts);

app.get("/", (req, res) => {
      res.send("hii i am a root route");
});
app.listen(3000, () => {
      console.log("server is listening on 3000 port");
});