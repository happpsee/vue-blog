/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-03 14:19:52
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-09 12:05:24
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\views\Login\form.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const formConfigMap =  {
  "login": {
    title: '登录',
    type: 'login',

    formItems: [
      {
        label: '用户名',
        query: 'username',
        type: 'text',
        placeholder: '请输入用户名'
      },
      {
        label: '密码',
        query: 'password',
        type: 'password',
        placeholder: '请输入密码'
      }
    ],
    btns: [
      {
        name: 'close',
        text: '取消'
      },
      {
        name: 'login',
        text: '提交'
      }
    ]
  },
  "registry": {
    title: '注册',
    type: 'registry',

    formItems: [
      {
        label: '用户名',
        query: 'username',
        type: 'text',
        placeholder: '请输入用户名'
      },
      {
        label: "邮箱",
        query: "email",
        type: "text",
        placeholder: "请输入邮箱地址"
      },
      {
        label: '密码',
        query: 'password',
        type: 'password',
        placeholder: '请输入密码'
      }
    ],
    btns: [
      {
        name: 'close',
        text: '取消'
      },
      {
        name: 'registry',
        text: '提交'
      }
    ]
  }
}

export const validateConfigMap = {
  username: [
    { required: true, message: '账号必填', trigger: 'blur'},
    { pattern: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{4,12}$/, message: '账号格式 数字+字母 6-8位' , trigger:'blur'}],
  email: [
    { required: true, message: '邮箱必填', trigger: 'blur'},
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  password: [
    { required: true, message: '密码必填', trigger:'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/, message: '密码格式 至少包含大写字母+小写字母+数字 8-12位'}]
}