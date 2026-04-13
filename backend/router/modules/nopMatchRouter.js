const express = require("express");
const router = express.Router();

router.use("*", (req, res) => {

  console.log("请求的路径", req);

  res.json({
    message: "没有该url"
  })
});
module.exports = {
  noMatchRouter:router
}