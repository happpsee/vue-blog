
import {createSetupAxios as createRequest, defineRequest, reqInterceptor, resInterceptor} from '@blog/axios-setup';
import { encrypt } from '@/utils/index.js';
import store from "store";



//组建配置表
const requestMap = Object.values(import.meta.glob("./modules/*.js", {
  eager: true
})).reduce((acc, curr) => (Object.assign(acc, curr.default), acc), {});


//封装useApi
export const useApi = (name, data = {}, config = {}) => {
  return defineRequest(({request, context}) => {
    const cfg = {...context.requestMap[name]};

    if (!cfg) {
      throw new Error(`接口 "${name}" 不存在`);
    }


    if (cfg.withToken) {
      reqInterceptor((config) => {
        //TODO: 获取Token的办法
        const token = store.get(import.meta.env.VITE_TOKEN_KEY);
        console.log('toej', token);
        config.headers ?? (config.headers = {});
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      });
    }

    if (cfg.rsaKey?.length > 0) {
      //TODO: 获取getPublicKey
      const publicKey = store.get(import.meta.env.VITE_PUBLICK_KEY); 
      console.log(publicKey)
        cfg.rsaKey.forEach((key) => {
          data[key] = encrypt(publicKey, data[key]);
        });
    }

    if (cfg.setToken) {
      resInterceptor((response) => {
        console.log(response, 'response');
        store.set(import.meta.env.VITE_TOKEN_KEY, response.data.data.token);
        return response;
      });
    }

    if (cfg.dynamic) {
      console.log(cfg.url, "cfg.url");
      cfg.url = cfg.url.replace(/\/([^\/]+)/g, ($1, capture) => {
        console.log(capture, data, "cfg.url", cfg.url);
        return data[capture] ? '/' + data[capture] : $1;
      });
      data = {};
    }

    if (data.path && cfg.custom) {
      cfg.url = data.path;
      delete data.path;
    }

    if (cfg.method.toUpperCase() === 'GET') {
      config.params = data;
    } else {
      config.data = data;
    }

    config.url = cfg.url;
    config.method = cfg.method.toUpperCase();

    return request.request(config);
  });
};




//装载上vue实例
export const createSetupAxios = (app, options) => {
  
  const {baseURL, timeout} = options;

  const { request, addInstanceOptions, addGlobalInterceptor } = createRequest({
    defaultReq: true,
    baseURL,
    timeout
  });

  addInstanceOptions({
    requestMap
  });

   addGlobalInterceptor('response', (response) => {
    return response.data.data;
   });


  app.provide('api', {
    useApi,
    request,
    addInstanceOptions,
    addGlobalInterceptor
  });

}








// const requestMap = {
//     "registry": {
//       url: "/register",
//       method: "POST",
//       rsaKey: ["password"]
//     },
//     "pwdLogin": {
//       url: "/login",
//       method: "POST",
//       rsaKey: ["password"],
//     },
//     "user": {
//       withToken: true,
//       url: "/",
//       method: "POST"
//     },
//     "pubKey": {
//       withToken: false,
//       url: "/getPublicKey",
//       method: "GET"
//     },
//     "articles": {
//       url: "/api/articles",
//       method: "GET"
//     },
//     "publishArticle": {
//       url: "/api/articles",
//       method: "POST",
//       withToken: true
//     },
//     "upload": {
//       url: "/upload/article",
//       method: "POST",
//       withToken: true
//     },
//     "column": {
//       url: "/api/columns",
//       method: "GET",
//       withToken: true
//     },
//     "addColumn": {
//       url: "/api/columns",
//       method: "POST",
//       withToken: true
//     },
//     "pubComment": {
//       url: "/api/comments",
//       method: "POST",
//       withToken: true
//     },
//     "articleSearch": {
//       url: "/articles/search",
//       method: "GET"
//     },
//     "articleDetail": {
//       url: "/api/articles/",
//       method: "GET",
//       dynamic: true
//     },
//     "getUserInfo": {
//       url: "/user",
//       method: "GET",
//       withToken: true
//     },
//     "changeUserInfo": {
//       url: "/user",
//       method: "PUT",
//       withToken: true
//     },
//     "uploadUser": {
//       url: "/upload/user",
//       method: "POST",
//       withToken: true
//     }
// };

