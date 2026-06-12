const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
      res.send("get for user route");
})
// show route
router.get("/:id", (req, res) => {
      res.send("get for users /id route");
});
// create route
router.post("/", (req, res) => {
      res.send("post for users route");
})
//update route
router.put("/:id", (req, res) => {
      res.send("put for user/:id route");
})
// delete route
router.delete("/:id", (req, res) => {
      res.send("delete for user/:id route");
})
module.exports = router;