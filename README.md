**baby-front**
===============

家教听说产品前端页面

### 使用方法

下载项目
    
    git clone http://code.hoolai.com/git/hongcai/baby-front.git
    cd baby-front

环境设置（建议使用 `cnpm`，确保 `nodejs` 版本 5+，`npm` 版本 3+）

    npm install -g webpack webpack-dev-server typescript

安装依赖

    cnpm install

浏览器中预览项目，默认会启用 `livereload`

    npm start


### 文档
构建api文档

    npm run build.docs

### 打包

测试环境打包

    npm run build.dev

生产环境打包

    npm run build.prod

生产环境AOT方式打包

    npm run build.prod.exp

### 高级


#### 修改启动端口

如将端口修改为3000

打开 package.json，找到以下代码

```
"start": "gulp serve.dev --color"
```

修改为

```
"start": "gulp serve.dev --color --port 3000"
```

#### 修改后端代理接口

打开 project.config.ts，找到

```
  getProxyMiddleware(): Array<any> {
    const proxyMiddleware = require('http-proxy-middleware');
    return [
      proxyMiddleware('/baby', {
      ws: false,
        target: 'http://192.168.5.199:8080'
      })
   ];
  }
```

修改 `target` 后的地址。