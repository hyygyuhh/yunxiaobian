# 网易云乐谱工具（浏览器插件）

内置乐谱 API，可独立使用，无需 `npm start`。同时保留 Cookie 助手功能，方便登录。

## 功能

- **独立乐谱工具**：点击插件 →「打开乐谱工具」，在扩展内打开完整 UI（查乐谱、上传、贡献积分等）
- **一键复制 Cookie**：在 music.163.com 登录后复制 Cookie
- **自动复制**：登录后自动复制（可关闭）
- **网易云页面**：右下角浮动按钮「复制 Cookie」
- **本地开发模式**：`npm start` 后访问 http://localhost:3100 仍可使用（与扩展并行）

## 安装（Chrome / Edge）

1. 在项目根目录构建扩展资源：

   ```bash
   npm run build:extension
   ```

2. 打开扩展管理页
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. 开启 **开发者模式**
4. **加载已解压的扩展程序**，选择 `NE/extension` 目录

修改 `public/` 或 `lib/` 后需重新执行 `npm run build:extension` 并在扩展管理页 **重新加载** 插件。

## 使用步骤

### 扩展独立模式（推荐）

1. 在浏览器打开 [music.163.com](https://music.163.com) 并登录
2. 点击插件图标 → **打开乐谱工具**
3. 在工具页点击 **登录**，或先用插件 **复制 Cookie** 再粘贴登录

### 本地服务模式

1. 运行 `npm start`，打开 http://localhost:3100
2. 在 music.163.com 登录后，用插件复制 Cookie 或在页面点击 **插件填入 Cookie**

## 批量上传（ccgq 导出文件夹）

1. 用 ccgq 从**网易云歌单**批量导出 PDF（新版会自动带上歌曲 ID）
2. 在「乐谱管理 → 批量上传」选择该文件夹 → **扫描文件** → **开始批量上传**

ccgq 导出时会：
- 文件名加 ID 前缀：`460043704_歌名.pdf` / `460043704_歌名_C调.pdf`
- 自动生成 `manifest.json` 记录 file ↔ songId

因此从歌单导出的 PDF **通常无需再点「匹配歌曲 ID」**。


| 模式 | API 运行位置 |
|------|----------------|
| 扩展独立 | Service Worker 内打包的 `api.bundle.js` |
| 本地服务 | Node.js `server.js` + `lib/apiRouter.js` |

前端通过 `api-shim.js` 将 `/api/*` 请求转发到扩展后台，因此 UI 代码与本地版共用同一份 `public/app.js`。

## 权限说明

| 权限 | 用途 |
|------|------|
| cookies | 读取 music.163.com 登录 Cookie |
| storage | 保存自动复制开关 |
| notifications | 复制成功时提示 |
| scripting / tabs | 复制 Cookie、打开乐谱工具页 |
| host_permissions | 访问网易云 API、NOS 上传域名 |

Cookie 与乐谱数据仅在本地处理，不会上传到第三方服务器。

## 常见问题

**提示「扩展 API 未加载」？**  
请先运行 `npm run build:extension` 生成 `extension/api.bundle.js`，再重新加载插件。

**大文件上传失败？**  
扩展模式通过消息传递发送 PDF，超大文件可能受 Chrome 消息大小限制；可改用 `npm start` 本地模式上传。

**提示未登录？**  
必须在 **浏览器** 打开 [music.163.com](https://music.163.com) 网页版登录（客户端 App 无效），登录后刷新并重新检测。

**Edge / Chrome 均支持**，Manifest V3 格式。
