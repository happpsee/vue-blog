export default {
  username: [
    { required: true, message: '账号必填'},
    { pattern: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{4,12}$/, message: '账号格式 数字+字母 6-8位'}],
  description: [{ required: true, message: '个人介绍必填'}],
  signature: [{ required: true, message: '签名必填'}],
  nickname: [
    { required: true, message: '昵称必填'}],
  email: [
    { required: true, message: '邮箱必填'},
    { type: 'email', message: '请输入正确的邮箱格式'}],
  password: [
    { required: true, message: '密码必填' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/, message: '密码格式 至少包含大写字母+小写字母+数字 8-12位'}]
}


