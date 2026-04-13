const {formatTime} = require("./utils");
const jwt = require("jsonwebtoken");
const assert = require("http-assert");

const chatTypeMap = {
  //用户进入
  USERENTER: 1 << 0,
  [1 << 0]: "USERENTER",
  //用户离开
  USERLEAVE: 1 << 1,
  [1 << 1]: "USERLEAVE",
  //修改昵称
  CHANGEINFO: 1 << 2,
  [1 << 2]: "CHANGEINFO",
  //用户没进入房间
  USER_NOT_FOUND: 1 << 3,
  [1 << 3]: "USER_NOT_FOUND",
  //发送消息
  SENDMESSAGE: 1 << 4,
  [1 << 4]: "SENDMESSAGE",
  //发送聊天信息
  CHATHISTORY: 1 << 5,
  [1 << 5]: "CHATHISTORY",
};

const LISTEN_TYPES_ARR = Object.entries(chatTypeMap).filter((item) => {
  return !isNaN(item[0]);
});


const maxCountMsg = 2;
const LIVE_USER = new Map();
//避免空槽位
const MESSAGE = Array.from({length: maxCountMsg}, () => 0);
let curMsgIdx = 0;
const USER_ID = Symbol("userId");

const writeChatMessage = async function (Chat) {
  for (let i = 0, item; item = MESSAGE[i]; i++) {
    await Chat.create(MESSAGE[i]);
  }
}
const hasUser = function (socket) {
  let userId = socket[USER_ID];
  return (userId && LIVE_USER.has(userId));
}


//切换昵称或头像
const CHANGEINFO = function (socket, data) {
  if (!hasUser(socket)) {
    socket.emit(chatTypeMap["USER_NOT_FOUND"], "没有该用户");
    return false;
  }
  let userId = socket[USER_ID];
  const user = LIVE_USER.get(userId);
  const oldNickname = user.nickname;

  if (data.name === "nickname") {
    user.nickname = data.value;
  } else if (data.name === "avatar") {
    user.avatar = data.value;
  }

  socket.emit(chatTypeMap["CHANGEINFO"], {
    oldNickname,
    nickname: user.nickname, 
    avatar: user.avatar,
    date: formatTime(new Date(), "yyyy-mm-dd hh:mimi"),
  });
}
//发送消息
const SENDMESSAGE = async function (socket, msg) {
  if (!hasUser(socket)) {
    socket.emit(chatTypeMap["USER_NOT_FOUND"], "没有该用户");
    return false;
  }

  const user = LIVE_USER.get(socket[USER_ID]);
  const msgRecord = {
    message: msg,
    nickname: user.nickname,
    avatar: user.avatar,
    date: formatTime(new Date(), "yyyy-mm-dd hh:mimi"),
  }

  MESSAGE[curMsgIdx] = { ...msgRecord, uid: user.userId };
  console.log(user, "看看当前user");

  if (curMsgIdx === maxCountMsg - 1) {
    await writeChatMessage(this.Model.Chat);
  }
  curMsgIdx = (curMsgIdx + 1) % maxCountMsg;
  //当填充完毕最后一个的时候,充入数据库
  this.io.sockets.emit(chatTypeMap["SENDMESSAGE"], { ...msgRecord, isMe: true });
}
//查找聊天历史
const pageSize = 15;
const CHATHISTORY = async function (socket, data) {
  if (!hasUser(socket)) {
    socket.emit(chatTypeMap["USER_NOT_FOUND"], "没有该用户");
    return false;
  }
  //TODO, 实现历史聊天记录的查询
  let history = [];
  let curPage = data.cur ?? 0;
  let start = curPage * pageSize;
  let end = (curPage + 1) * pageSize;


  if (end > curMsgIdx) {
    let CACHE_HISTORY = await this.Model.Chat.find();
    let arr = [...CACHE_HISTORY, ...MESSAGE.slice(0, curMsgIdx)].reverse();

    history = arr.slice(start, end).filter(Boolean).reverse();
  } else  {
    let arr = MESSAGE.slice(0, curMsgIdx).reverse();
    history = arr.slice(start, end).filter(Boolean).reverse();
  }



  socket.emit(chatTypeMap["CHATHISTORY"], history.map(item => {
    let {uid, __v, ...ans} = item?.toObject?.() ?? item ?? {};
    if (String(uid) === String(socket[USER_ID])) {
       ans.isMe = true;
    }
    return ans;
  }));
}

//用户进入聊天室
const USERENTER = async function (socket, data) {
  try { 
    let token = data.token;
    assert(token, "没有token");
    const payload  = jwt.verify(token, this["publicKey"]);
    const user = await this.Model.User.findById(payload.id);
    const userId = payload.id;

    console.log(LIVE_USER.has(userId), "has(userId)", userId, LIVE_USER);
    if (LIVE_USER.has(userId)) {
      socket.emit(chatTypeMap["USER_NOT_FOUND"], "用户已登录留言板");
      return false;
    }


    LIVE_USER.set(userId, {
      userId,
      nickname: data.nickname ?? user.nickname,
      avatar: data.avatar ?? user.avatar 
    });
    console.log(LIVE_USER, "看看LIVE_USER");
    socket[USER_ID] = userId;
    await Promise.resolve(CHATHISTORY.bind(this, socket)({cur: 0}));
    this.io.sockets.emit(chatTypeMap["USERENTER"], {
      nickname: user.nickname,
      avatar: user.avatar,
      date: formatTime(new Date(), "yyyy-mm-dd hh:mimi"),
    });

  } catch (err) {
    socket.emit(chatTypeMap["USER_NOT_FOUND"], err.message || "用户不存在");
    return false;
  }
}
//用户离开聊天室
const USERLEAVE = function (socket, data) {
  if (!hasUser(socket)) {
    socket.emit(chatTypeMap["USER_NOT_FOUND"], "没有该用户");
    return false;
  }
  const user = LIVE_USER.get(socket[USER_ID]);
  LIVE_USER.delete(socket[USER_ID]);


  this.io.sockets.emit(chatTypeMap["USERLEAVE"], {
    nickname: user.nickname,
    avatar: user.avatar,
    date: formatTime(new Date())  ,
  });
}


const chatAgency = {
  USERENTER,
  USERLEAVE,
  CHANGEINFO,
  SENDMESSAGE,
  CHATHISTORY,
};


const DISCONNECT = function (socket) {
  if (!hasUser(socket)) {
    //如果已经发送了USER_LEAVE,则不通知，如果没有发送USER_LEAVE,则通知用户离开
    console.log("已经发送了USER_LEAVE,不通知用户离开");
    return false;
  }
  console.log("没有发送USER_LEAVE,通知用户离开", this);
  USERLEAVE.bind(this, socket)();  
};

const setupChat = (app, socket) => {
  for (let i = 0, item; item = LISTEN_TYPES_ARR[i]; i++) {
    const [key, value] = item;
    socket.on(key,  async (data) => {
      await Promise.resolve(chatAgency[value].bind(app.locals, socket)(data));
    });
  }
  socket.on("disconnect", async () => {
    console.log("连接断开了");
    await Promise.resolve(DISCONNECT.bind(app.locals, socket)());
  });
};
module.exports = {setupChat}