const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  chainWebpack: config => {
    config.plugin('monaco-editor').use(MonacoEditorPlugin, [
      {
        languages: ['json', 'javascript', 'html', 'css']
      }
    ])
  },
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}