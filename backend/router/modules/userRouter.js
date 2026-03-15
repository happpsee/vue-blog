const express = require("express");
const { User, Article } = require("../../models");
const router = express.Router();
const createError = require("http-errors");

//合并
router.get("/",async (req, res) => {
  
  const { detail } = req.query;

  console.log(detail, "detail");
  if (!detail) {
    res.json({
      code: 200,
      data: req.users,
      timestamp: Date.now()
    });
    return false;
  }


  let articles = await Article.aggregate([
    {
      $match: {
        author: req.users._id
      }
    },
    {
      $group: {
        _id: null,
        articleNum: {$sum: 1},
        readerNum: {$sum: "$clickNums"}
      }
    }
  ]);

  const users = JSON.parse(JSON.stringify(req.users));
  res.json({
    code: 200,
    data: {...users, articleNum: articles[0].articleNum, readNum:articles[0].readerNum},
    timestamp: Date.now()
  })

  //需要联查



});



router.put("/", async (req, res) => {
  const { nickName, signature, avatar, email, description} = req.body;
  
  const update = {};
  nickName && (update.nickName = nickName);
  signature && (update.signature = signature);
  avatar && (update.avatar = avatar);
  email && (update.email = email);
  description && (update.description = description);
  const _id = req.users._id;

  console.log(update, "update");
  if (Object.keys(update).length === 0) {
    return false;
  }

  try {
    const ans = await User.findByIdAndUpdate(_id, update, {new: true});

    res.json({
      code: 200,
      data: ans,
      timestamp: Date.now()
    });
  } catch (err) {
    createError(404, "更新失败");
  }
});


module.exports = {
  userRouter: router
};