module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: "./src/main.js",
      title: "定时关机、重启,"
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  configureWebpack: {
    resolve: {
      alias: {
        '@cpts': '@/components',
        '@mix': '@/mixin',
      }
    }
  }
}