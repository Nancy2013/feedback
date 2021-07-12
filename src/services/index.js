const context = require.context('./', false, /^\.\/(?!index)[^/]*\.js$/);
const apisList = context.keys().reduce((apis, key) => {
  const name = key.replace(/(^\.\/|\.js$)/g, '');
  const api = context(key).default;
  apis[name] = api;
  return apis;
}, {});

export default {
  ...apisList,
};
