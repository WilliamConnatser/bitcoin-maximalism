//This code is necessary for the prerender-spa-plugin to render for search engine bots
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const PuppeteerRenderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
  module: {
    rules: [
      // ... other rules omitted

      // this will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    ...
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // Required - Routes to render.
      routes: [
        '/',
        '/arguments',
        '/arguments/protagonistic',
        '/arguments/antagonistic',
        '/leaderboards',
        '/account',
        '/arguments/protagonistic/inflation',
        '/arguments/protagonistic/decentralization',
        '/arguments/protagonistic/efficiency',
        '/arguments/protagonistic/sidechains-and-layers',
        '/arguments/protagonistic/hard-money',
        '/arguments/protagonistic/censorship-resistant',
        '/arguments/protagonistic/interoperability',
        '/arguments/protagonistic/conspiracy',
        '/arguments/protagonistic/network-effect',
        '/arguments/protagonistic/toxic-community',
        '/arguments/protagonistic/resources',
        '/arguments/antagonistic/inflation',
        '/arguments/antagonistic/decentralized',
        '/arguments/antagonistic/efficiency',
        '/arguments/antagonistic/sidechains-and-layers',
        '/arguments/antagonistic/interoperability',
        '/arguments/antagonistic/conspiracy',
        '/arguments/antagonistic/network-effect',
        '/arguments/antagonistic/toxic-community',
        '/arguments/antagonistic/resources',
      ],
      renderer: new PuppeteerRenderer({
        renderAfterElementExists: '.apollo-response'
      })
    })
  ]
};