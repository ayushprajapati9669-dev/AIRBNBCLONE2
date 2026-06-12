const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
      res.send("get for posts route");
})
// show route
router.get("/:id", (req, res) => {
      res.send("get for posts /id route");
});
// create route
router.post("/", (req, res) => {
      res.send("post for posts route");
})
//update route
router.put("/:id", (req, res) => {
      res.send("put for posts/:id route");
})
// delete route
router.delete("/:id", (req, res) => {
      res.send("delete for posts/:id route");
})
module.exports = router;
