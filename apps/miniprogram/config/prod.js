module.exports = {
  env: {
    NODE_ENV: 'production',
  },
  defineConstants: {
    API_BASE: JSON.stringify(''),
  },
  mini: {},
  h5: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
}
