module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
      // vue项目启动时的ip地址和端口
      // host: '127.0.0.1',
      port: 8000,
      proxy: {
          // 匹配所有以 /api 开头的url
          '/api': {
              target:'http://47.115.162.68:8762',    //要访问的接口域名
              secure: false, // false为http访问，true为https访问
              changeOrigin: true, // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
              ws: true,
              //重写路径
              pathRewrite: {
                '^/api': ''
              }
          },
      }
  }
}
