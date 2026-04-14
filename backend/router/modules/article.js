const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const assert = require("http-assert");
const jwt = require("jsonwebtoken");
const P = require("mongoose-sex-page");
const {pagination} = require("../../core");

const articlePopulate = [
  {
    path: "author",
    select: "nickname avatar",
  },
  {
    path: "column",
    select: "name"
  },
  {  
    path: "comments",
    select: "content date likeNums",
    populate: {
      path: "uid",
      select: "nickname avatar"
    }
  }
];


router.get("/", async (req, res, next) => {
  let  query = req.query;
  try {
    let model = req.Model.Article;
    const ans = await pagination({
      query,
      model
    });
    res.json({
      code: 200,
      data: ans,
      timestamp: Date.now()
    });
  } catch (err) {
    console.log(err, "err");
    next(createError(422, err.message || "请求错误"));
  }
});

router.get("/:id", async (req, res, next) => {
  try { 
    assert(req.params.id, "找不到id");

    const ans = await req.Model.Article.findByIdAndUpdate(req.params.id, {
      "$inc": {
        clickNums: 1
      }
    }).populate(articlePopulate);

    res.json({
      code: 200,
      data: ans,
      timestamp: Date.now()
    });

  } catch (err) {
    next(createError(404, err.message || "查询失败"));
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.users._id, "req.users是什么1");
    let body =  { ...req.body, author: req.users._id };
    const ansModel = await req.Model.Article.create(body);

    console.log(ansModel, "ansModel", ansModel._id);
  await req.Model.Column.findByIdAndUpdate(body.column, {
    $push: {
      "aids": ansModel._id
    }
  });


    res.json({
      code: 200,
      data: ansModel,
      timestamp: Date.now()
    });
    
  } catch (err) {
    console.log("为什么添加失败", err);
    next(createError(422, "添加失败"));
  }
});

//更改资源
const revisable = ["title", "cover", "content", "column", "summary"];
router.put("/:id", async (req, res, next) => {
  try {
    let id = req.params.id; //文章id
    let userId = req.users._id;//用户id
    let putData = revisable.reduce((acc, curr) => {
      req.body[curr] && (acc[curr] = req.body[curr]);
      return acc;
    }, {}); // 修改数据
    
    const data = await req.Model.Article.findOneAndUpdate({ 
      _id:id,
      author: userId,
    }, putData, {
      new: true
    });

    const article = await req.Model.Article.findOne({ _id: id, author: userId });
    
    assert(article, "文章不存在");
    
    res.json({
      code: 200,
      data,
      message: "修改成功",
      timestamp: Date.now()
    })
  } catch (err) {
    console.log(err, "文章修改失败");
    
    next(createError(err.status || 422, err.message || "修改失败"));
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    await req.Model.Article.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      data: "删除成功",
      timestamp: Date.now()
    })

  } catch (err) {
    next(createError(err.status || 404, err.message || "删除失败,或未找到"));
  }
});


//文章点赞
router.get("/like/:id", async (req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, req.app.locals["privateKey"]);
    req.userId = payload.id;
  } catch (err) {
    console.log("看看错误", err);
  } finally {
    next();
  }
  
}, async (req, res, next) => {
  try {  
    let id = req.params.id;
    assert(id, "缺少参数id");
    let query = {};
    (!!req.query.like) && (query["$inc"] = {
      likeNums:  req.query.like
    });
    (!!req.query.star) && (query["$inc"] = {
      starNums:  req.query.star
    });
    let result = await req.Model.Article.findByIdAndUpdate(id, query, {new:true});
    res.json({
      code: 200,
      data: result,
      timestamp: Date.now()
    });
  } catch (err) {
    next(createError(422, err.message || "点赞错误"));
  }

});


router.get("/api/search", async (req, res, next) => {
  console.log("req.model");
  let {search = "", size = 20, page = 1, display = 5} = req.query;
  let regExp = new RegExp(search, "gi");
  try {
    const result = await P(req.Model.Article)
    .find({     
      $or: [
          {title: {$regex: regExp}},
          {content: {$regex: regExp}}
      ]
    })
    .size(size)
    .page(page)
    .display(display)
    .exec();

    result.data = result.records;
    delete result.records;

    res.json({
      code: 200, 
      data: result,
      timestamp: Date.now()
    });

  } catch (err) {
    next(createError(err.status || 400, err.message || "查询错误"));
  }
});


router.post("/addcomment", async (req, res, next) => {
  try {
    let body = { uid: req.users._id, ...req.body };

    const ansModel = await req.Model.Comment.create(body);
    let { fieldIds } = body;
    let _id = ansModel._id;


    await req.Model.Article.findByIdAndUpdate(fieldIds.aid, {
      $push: {
        "comments": ansModel._id
      }
    });

    res.json({
      code: 200,
      data: ansModel,
      timestamp: Date.now()
    });
    
  } catch (err) {
    next(createError(422, "评论添加失败"));
  }
});

module.exports = {
  articleRouter:router
}