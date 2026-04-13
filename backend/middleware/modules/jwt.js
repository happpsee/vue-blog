const { expressjwt, UnauthorizedError } = require("express-jwt");
const createError = require("http-errors");



const setupJwt = (app) => {
  const secret = app.locals["publicKey"];

  app.use(expressjwt({
    secret,
    algorithms: ["RS256"],
    isRevoked: async (req, token) => {
      let {payload} = token;
      const {id} = payload;
      if (!id || id.trim().length === 0) {
        return true;
      }
      try {
        let result = await req.app.locals.Model["User"].findById(id);

        if (!result) {
          return false;
        }
        req.users = result;

      } catch (err) {
        console.log("err", err);
        return true;
      }
      return false;
    }   
  }).unless({
    path: [
      { url: "/login", methods: ["POST"] },
      { url: "/register", methods: ["POST"] },
      { url: "/api/comments", methods: ["GET"] },
      {url:"/user/registry", methods: ["POST"]},
      {url:"/user/login", methods: ["POST"]},
      "/getPublicKey",
      "/articles/search",
      /loginSSE\/*/,
      { url: /api\/articles\/.*/, methods: ["GET"] },
      { url: "/api/articles", methods: ["GET"] },
      { url: /articles\/likes\/.*/, method: "GET" },
      { url: "/api/articledetail", methods: ["GET"] },
      {url: /article\/*/, methods: ["GET"]}
    ]
  }), (err, req, res, next) => {
    console.log(err, '鉴权错误');
    if (err instanceof UnauthorizedError) {
      next(createError(401, "没有权限"));
    }
  });
};


module.exports = {
  setupJwt
}