export default {
  "userInfo": {
    title: "用户信息",
    type: "userInfo",
    formItems: [
      {
        label: "用户",
        query: "username",
        type: "text",
        placeholder: "请输入用户名",
      },
      {
        label: "昵称",
        query: "nickname",
        type: "text",
        placeholder: "请输入昵称",
      },
      {
        label: "签名",
        query: "signature",
        type: "text",
        placeholder: "请输入签名",
        textComp: "textarea"
      },
      {
        label: "描述",
        query: "description",
        type: "text",
        placeholder: "请输入描述",
        textComp: "textarea"
      },
      {
        label: "邮箱",
        query: "email",
        type: "text",
        placeholder: "请输入邮箱",
      },
    ],
    btns: [
      {
        name: 'close',
        text: '返回首页'
      },
      {
        name: 'submit',
        text: '提交'
      }
    ]
  }
}
