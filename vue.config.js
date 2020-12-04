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
              // target:'http://localhost:8000',
              secure: false, // false为http访问，true为https访问
              changeOrigin: true,
              ws: true,
              //重写路径
              pathRewrite: {
                '^/api': ''
              }
          },
      }
  }
}
