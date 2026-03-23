export default {
 "registry": {
    title: '注册',
    type: 'registry',

    formItems: [
      {
        label: '用户',
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
        name: 'submit',
        text: '提交'
      }
    ]
  }
}