const regexp = /[\\\/]src[\\\/]mviews[\\\/]/;

export default {
  plugins: {
    "autoprefixer": {
      overrideBrowserslist: ["last 15 versions"]
    },
      "postcss-pxtorem": {
        rootValue: 37.5,
        propList: ["*"],
        selectorBlackList: ["van-", "el-"],
        exclude: (filePath) => {
          return !regexp.test(filePath);
        }
      }
  }
}