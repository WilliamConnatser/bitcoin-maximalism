
//Needed because I was getting a lot of errors without it
//See: https://github.com/Akryum/vue-cli-plugin-apollo/issues/58
module.exports = {
    // ...
    chainWebpack: config => {
      // ...
      config.resolve
        .extensions
          .prepend('.mjs')
  
      config.module
        .rule('mjs')
          .test(/\.mjs$/)
          .include
            .add(/node_modules/)
            .end()
          .type('javascript/auto')
        // ...
    },
    // ...
  }