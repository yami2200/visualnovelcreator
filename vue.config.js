const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  chainWebpack: config => {
    config.plugin('monaco-editor').use(MonacoEditorPlugin, [
      {
        languages: ['json', 'javascript', 'html', 'css']
      }
    ]);
  },
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.yamiprod.visualnovelcreator",
        productName : "Visual Novel Creator",
        win: {
          icon: 'public/temporarylogo.png'
        },
        extraFiles: [
          {
            from: "./public/packageWindows/",
            "to": "./packageWindows/"
          }
        ]
      },
      nodeIntegration: true
    }
  }
}