const express = require('express');

const {staticPath} = require("../../config");

const setupCommon = (app) => {
    app.use(express.json());
    app.use(express.urlencoded());
    //静态资源暂时代理中间件
    app.use(express.static(staticPath));
};

module.exports = {
  setupCommon
}