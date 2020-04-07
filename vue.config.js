module.exports = {
  css: {
    loaderOptions: {
      // 全局注入主题样式变量
      sass: {
        prependData: `@import "~@/styles/theme.scss"`
      },
      scss: {
        prependData: `@import "~@/styles/theme.scss";`
      }
    }
  }
};
