const jwt = require("jsonwebtoken");

const LIVE_USER = new Map();


const heartbeatInterval = (res) => {
  let timer = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 12000);
  return () => clearInterval(timer);
};

const setupSSE = (app) => {
  app.get("/loginSSE", (req, res, next) => {
    let token = req.query.token;
    try {
      const payload  = jwt.verify(token, req.app.locals["publicKey"]);
      let userId = payload.id;

      console.log("居然没有冲突吗", userId, LIVE_USER,);
      if (LIVE_USER.has(userId)) {
        console.log("不是冲突了吗包子", userId);
        const conflictRes = LIVE_USER.get(userId);
        conflictRes.end("data: logout\n\n");
        LIVE_USER.delete(userId);
      }

      LIVE_USER.set(userId, res);
      res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
      res.write("retry:15000\n\n");

      setTimeout(() => {
        res.write("data: sss\n\n");
      }, 2000);

      const clearInterval = heartbeatInterval(res);
      res.on("close", () => {
        console.log("close");
        LIVE_USER.delete(userId);
        clearInterval();
      });


    } catch (err) {
      console.log("SSE弄的", err);
      return false;
    }
  });
};

module.exports = {
  setupSSE
}