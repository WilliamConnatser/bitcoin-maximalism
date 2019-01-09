//This code is necessary for the prerender-spa-plugin to render for search engine bots
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  plugins: [
    ...
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // Required - Routes to render.
      routes: [ '/']
    })
  ]
};