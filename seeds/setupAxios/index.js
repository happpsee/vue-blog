import axios from "axios";


let globalInstances = new WeakMap();
let defaultUseRequest = null;
let prevRequest = null;

let recycles = [];

export const addRecycle = (callback) => {
  recycles.push(callback);
};

export const consumRecyCle = () => {
  for (let i = 0, len = recycles.length; i < len; i++) {
    recycles[i]();
  } 
  recycles.length = 0;

};


export const defineRequest = async function (callback, options = {}) {
  let request = options.useRequest ?? defaultUseRequest ?? prevRequest;
  let instance = globalInstances.get(request);

  prevRequest = request;

  try {
    const res = await callback({request, context: instance});
    return res;
  } finally {
    consumRecyCle();
  }
};


// options.useRequest > 当前defineRequest 上下文 ? 全局默认
export const reqInterceptor = function (callback, options = {}) {
  let request = options.useRequest ??  defaultUseRequest ?? prevRequest;
  let instance = globalInstances.get(request);
  instance.reqInterceptors.push(callback);

  addRecycle(() => {
    let idx = instance.reqInterceptors.indexOf(callback);
    (idx !== - 1) && instance.reqInterceptors.splice(idx, 1);
  });
};

export const resInterceptor = function (callback, options = {}) {
  let request = options.useRequest ??  defaultUseRequest ?? prevRequest;
  let instance = globalInstances.get(request);

  instance.resInterceptors.push(callback);

  addRecycle(() => {
    let idx = instance.resInterceptors.indexOf(callback);
     (idx !== -1) && instance.resInterceptors.splice(idx, 1);
  });
 
}; 




export const createSetupAxios = (options) => {
 
 const {defaultReq,  ...axiosOptions} = options;

 console.log(axiosOptions, 'axiosOptions');
  const request = axios.create(axiosOptions);


  const instance = {};

  instance.reqInterceptors = [];
  instance.resInterceptors = [];

  request.interceptors.request.use((config) => {
    return instance.reqInterceptors.reduce((acc, curr) =>  curr(acc), config);
  });

  request.interceptors.response.use((config) => {
    return instance.resInterceptors.reduce((acc, curr) => curr(acc), config);
  });

  const addGlobalInterceptor = (type = 'request', callback) => {
    if (type !== 'request' && type !== 'response') {
      console.warn('找不到对应的拦截器');
      return false;
    }
    request.interceptors[type].use(callback);
    return true;
  };

  const addInstanceOptions = (options) => {
    Object.assign(instance, options);
  };

  defaultReq && (defaultUseRequest = request);
  globalInstances.set(request, instance);

  return {
    request,
    addInstanceOptions,
    addGlobalInterceptor
  };
};


// import axios from "axios";


// let globalInstances = new WeakMap();
// let defaultUseRequest = null;
// let prevRequest = null;

// let recycles = [];

// export const addRecycle = (callback) => {
//   recycles.push(callback);
// };

// export const consumRecyCle = () => {
//   for (let i = 0, len = recycles.length; i < len; i++) {
//     recycles[i]();
//   } 
//   recycles.length = 0;

// };


// export const defineRequest = async function (callback, options = {}) {

//   let request = options.useRequest ?? defaultUseRequest;
//   let instance = globalInstances.get(request);

//   prevRequest = request;


//   try {
//     const res = await callback({request, context: instance});
//     return res;
//   } finally {
//     consumRecyCle();
//   }
// };


// // options.useRequest > 当前defineRequest 上下文 ? 全局默认
// export const reqInterceptor = function (callback, options) {
//   let request = options.useRequest ??  defaultUseRequest ?? prevRequest;
//   let instance = globalInstances.get(request);
//   instance.reqInterceptors.push(callback);

//   addRecycle(() => {
//     let idx = instance.reqInterceptors.indexOf(callback);
//     (idx !== - 1) && instance.reqInterceptors.splice(idx, 1);
//   });
// };

// export const resInterceptor = function (callback, options) {
//   let request = options.useRequest ??  defaultUseRequest ?? prevRequest;
//   let instance = globalInstances.get(request);

//   instance.resInterceptors.push(callback);

//   addRecycle(() => {
//     let idx = instance.resInterceptors.indexOf(callback);
//      (idx !== -1) && instance.resInterceptors.splice(idx, 1);
//   });
 
// }; 




// export const createSetupAxios = (options) => {
 
//  const {defaultReq,  ...axiosOptions} = options;

//   const request = axios.create(axiosOptions);


//   const instance = {};

//   instance.reqInterceptors = [];
//   instance.resInterceptors = [];

//   request.interceptors.request.use((config) => {
//     return instance.reqInterceptors.reduce((acc, curr) =>  curr(acc), config);
//   });

//   request.interceptors.response.use((config) => {
//     return instance.resInterceptors.reduce((acc, curr) => curr(acc), config);
//   });

//   const addGlobalInterceptor = (type = 'request', callback) => {
//     if (type !== 'request' && type !== 'response') {
//       console.warn('找不到对应的拦截器');
//       return false;
//     }
//     request.interceptors[type].use(callback);
//     return true;
//   };

//   const addInstanceOptions = (options) => {
//     Object.assign(instance, options);
//   };

//   defaultReq && (defaultUseRequest = request);
//   globalInstances.set(request, instance);
  
//   return {
//     request,
//     addInstanceOptions,
//     addGlobalInterceptor
//   };
// };
