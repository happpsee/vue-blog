const fs = require("fs");
const path = require("path");
const {rootPath} = require("../../config");
const NodeRsa = require("node-rsa");
const typeMap = {
  "privateKey": "privateKey.cer",
  "publicKey": "publicKey.cer"
};

//加密指定数据
const encrypt = (publicKey, data) => {
  const key = new NodeRsa(publicKey);
  const ans = key.encrypt(data, "base64");
  return ans;
};

//解密指定数据
const decrypt =  (privateKey, data) => {
  try {
  const key = new NodeRsa(privateKey);
  const ans = key.decrypt(data, "utf8");
  return ans;
  } catch (err) {
    console.log(err, 'decrypt');
    throw err;
  }
};


const getSecretKey = async (path) => {
  try {
    const ans =  fs.readFileSync(path, "utf8");
    return ans;
  } catch (err) {
    throw new Error("读取密钥失败");
  }
};

const setupSecretKey = async (app) => {
  for (const [key, value] of Object.entries(typeMap)) {
    let secretPath = path.join(rootPath, "config", "secrets", value);
    let secret = await getSecretKey(secretPath);
    app.locals[key] = secret;
    app.locals.globalFns[key] = secret;
  }

  app.locals.globalFns = {
    encrypt: encrypt.bind(null, app.locals["publicKey"]),
    decrypt: decrypt.bind(null, app.locals["privateKey"]),
  }
};

module.exports = {
  setupSecretKey
}