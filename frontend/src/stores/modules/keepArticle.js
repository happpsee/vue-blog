

const articles = new Map();


export const getArticles = (id) => {
  return articles.get(id);
}

export const addArticles = (id, data) => {
  return articles.set(id, data);
}

// const LRUCacheFactory = (capacity) => {
//   const cache = new Map();
//   const LRUCache = {};
//   //Map对象保存键值对，并且能够记住见的原始插入顺序
//   const get = (key) => {
//     if (!cache.has(key)) {
//       console.log('没有key');
//       return ;
//     }
//     let temp = cache.get(key);
//     cache.delete(key);
//     cache.set(key, temp);

//     return temp;
//   };
//   const set = (key, value) => {
//     if (cache.has(key)) {
//       cache.delete(key);
//     }
//     if (cache.size >= capacity) {
//       cache.delete(cache.keys().next().value);
//     }
//     cache.set(key, value);
//   };
//   LRUCache.get = get;
//   LRUCache.set = set;

//   LRUCache[Symbol.iterator] = () => cache[Symbol.iterator];

//   return LRUCache
// };
