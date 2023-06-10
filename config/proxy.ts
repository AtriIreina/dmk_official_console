/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  //TODO: WAIT 修改为服务器地址
  dev: {
    // localhost:8000/api/** -> http://localhost:9030/dmk/**
    '/api': {
      // 要代理的地址
      // target: 'http://localhost:9003/dmk/system', //微服务
      target: 'http://localhost:9005/dmk', //开发环境 网关
      // target: 'http://120.78.137.60:9005/dmk', //生产环境 网关
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  test: {
    '/api': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
