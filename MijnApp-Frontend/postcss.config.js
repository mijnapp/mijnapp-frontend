module.exports = () => ({
  plugins: [
    require('postcss-easy-import')({
      extensions: [
        '.pcss',
        '.css',
        '.postcss',
        '.sss'
      ]
    }),
    require('stylelint')({
      configFile: '.stylelintrc'
    }),
    require('postcss-mixins'),
    require('postcss-nesting'),
    require('postcss-custom-media'),
    require('postcss-selector-not'),
    require('postcss-discard-comments'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    }),
    require('postcss-reporter')({
      clearReportedMessages: true,
      noPlugin: true
    })
  ]
});
