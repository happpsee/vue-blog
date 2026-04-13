const mongoose = require("mongoose");

module.exports = {
  message: {
    type: mongoose.SchemaTypes.String,
    default: "消息"
  },
  date: {
    type: mongoose.SchemaTypes.String,
  },
  nickname: {
    type: mongoose.SchemaTypes.String,
    default: "用户"
  },
  avatar: {
    type: mongoose.SchemaTypes.String,
    default: ""
  },
  uid: {
    type: mongoose.SchemaTypes.ObjectId
  }
};