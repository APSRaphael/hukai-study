### 1 package.js

```js
{
  "name": "lesson1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack " // 默认 获取当前文件同级 webpack.config.js
    // "dev": "webpack --config webpack.config.js"  可以配置任意 config 文件名称，如 hk.config.js/hk.js
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  }
}

```

