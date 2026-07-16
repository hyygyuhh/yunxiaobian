# 网易云乐谱工具 React Native APP 技术设计

## 1. 项目概述

将现有网易云乐谱工具 Chrome 扩展的全套功能移植为 React Native 移动应用，覆盖 Android 和 iOS 双平台。APP 直接与网易云服务器通信，无需自建后端。

### 功能范围

四个核心模块全部移植：

- 乐谱分析：链接/搜索/排行榜查询，结果筛选，保存歌单
- 乐谱上传：单曲上传，批量上传（ccgq 文件夹解析），已上传列表管理
- 云小编：签到，积分明细，审核任务，抽奖，积分商城，贡献榜
- 扫码登录：EAPI 二维码登录，Cookie 持久化

## 2. 技术选型

| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | React Native + Expo | 一套代码双平台，Expo 降低环境配置复杂度 |
| 语言 | TypeScript | 类型安全，与原项目 JS 逻辑迁移时减少错误 |
| 状态管理 | Zustand | 轻量（~1KB），无 boilerplate，适合中小型 APP |
| 加密 | crypto-js | 从 Mine-Radio 项目验证过的 crypto-es 无缝迁移，npm 生态 RN 兼容性更好 |
| 存储 | react-native-mmkv | 高性能 KV 存储（替代 chrome.cookies），同步读写，加密支持 |
| 导航 | @react-navigation/native + Bottom Tabs | 成熟的 RN 导航方案 |
| 二维码 | react-native-qrcode-svg | 本地渲染二维码图片（替代 api.qrserver.com 外部服务） |
| 文件选择 | expo-document-picker | 批量上传时选择 PDF 文件 |
| PDF 预览 | react-native-pdf 或 WebView | 乐谱 PDF 在线预览 |
| 网络请求 | 原生 fetch | RN 内置，与浏览器扩展的 fetch 行为一致 |

## 3. 架构设计

### 分层结构

```
UI 层 (Screens + Components)
    |
状态管理层 (Zustand Stores)
    |
服务层 (Services / API 封装)
    |
加密层 (Crypto: weapi / eapi)
    |
存储层 (MMKV: Cookie 持久化)
```

每层只依赖其下层，不允许反向依赖或跨层调用。

### 数据流

```
用户操作 → Screen 调用 Zustand Store action
         → Store 调用 Service 层
         → Service 用 crypto 层加密请求
         → fetch 发送到网易云服务器
         → 响应回写到 Store
         → Screen 通过 Zustand selector 重渲染
```

## 4. 项目结构

```
netease-sheet-app/
├── src/
│   ├── crypto/
│   │   ├── index.ts          # 统一导出
│   │   ├── weapi.ts          # weapi 加密（AES-CBC + RSA）
│   │   └── eapi.ts           # eapi 加密（AES-ECB + MD5）
│   │
│   ├── services/
│   │   ├── neteaseApi.ts     # 基础网易云 API
│   │   ├── sheetApi.ts       # 乐谱相关 API
│   │   ├── ugcApi.ts         # 云小编 API
│   │   └── qrLogin.ts        # 扫码登录
│   │
│   ├── stores/
│   │   ├── authStore.ts      # 登录态 + Cookie + 用户信息
│   │   ├── analyzeStore.ts   # 乐谱分析
│   │   ├── uploadStore.ts    # 乐谱上传
│   │   └── ugcStore.ts       # 云小编
│   │
│   ├── storage/
│   │   └── cookieStorage.ts  # MMKV Cookie 读写
│   │
│   ├── screens/
│   │   ├── AnalyzeScreen.tsx # 乐谱分析（首页）
│   │   ├── AnalyzeDetailScreen.tsx  # 分析结果详情
│   │   ├── SheetPreviewScreen.tsx   # 乐谱 PDF 预览
│   │   ├── UploadScreen.tsx # 乐谱上传
│   │   ├── BatchUploadScreen.tsx    # 批量上传
│   │   ├── UgcScreen.tsx    # 云小编首页
│   │   ├── UgcExamScreen.tsx # 审核任务
│   │   ├── UgcMallScreen.tsx # 积分商城
│   │   ├── ProfileScreen.tsx # 我的
│   │   └── QrLoginScreen.tsx # 扫码登录全屏页
│   │
│   ├── components/
│   │   ├── SongItem.tsx      # 歌曲列表项
│   │   ├── SheetBadge.tsx    # 乐谱数量标签
│   │   ├── FilterBar.tsx     # 筛选条件栏
│   │   ├── UploadForm.tsx    # 上传表单
│   │   ├── QrCodeView.tsx   # 二维码展示组件
│   │   └── ScoreCard.tsx     # 积分卡片
│   │
│   ├── navigation/
│   │   ├── TabNavigator.tsx  # 底部 Tab 导航
│   │   └── RootNavigator.tsx # 根导航（含登录检查）
│   │
│   ├── hooks/
│   │   ├── useQrPolling.ts   # 二维码轮询 Hook
│   │   └── useUpload.ts      # 上传逻辑 Hook
│   │
│   ├── utils/
│   │   ├── ccgqParse.ts      # ccgq 文件名解析（从扩展移植）
│   │   └── musicKey.ts       # 调号工具（从扩展移植）
│   │
│   └── App.tsx
├── package.json
├── tsconfig.json
└── app.json
```

## 5. 核心模块设计

### 5.1 加密层

从 Mine-Radio 项目的 `vendor/crypto-es.mjs` 和 `api/eapi.js`、`api/weapi.js` 迁移，改为 TypeScript 并使用 npm 包 `crypto-js`。

**weapi.ts**：AES-CBC 加密（随机 IV，PKCS7）+ RSA 公钥加密（硬编码网易云 RSA 公钥）

**eapi.ts**：AES-ECB 加密（固定 key `e82ckenh8dichen8`）+ MD5 摘要。与扩展中的 `qr-login.js` 逻辑完全一致。

关键实现（eapi 加密函数）：

```typescript
import CryptoJS from 'crypto-js';

const EAPI_KEY = 'e82ckenh8dichen8';

function eapiEncrypt(url: string, object: Record<string, unknown>): string {
  const text = JSON.stringify(object);
  const message = `nobody${url}use${text}md5forencrypt`;
  const digest = CryptoJS.MD5(message).toString();
  const payload = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(payload),
    CryptoJS.enc.Utf8.parse(EAPI_KEY),
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
  );
  return encrypted.ciphertext.toString().toUpperCase();
}
```

### 5.2 存储层

`cookieStorage.ts` 用 react-native-mmkv 实现，替代 chrome.cookies API。

```typescript
import MMKV from 'react-native-mmkv';

const storage = new MMKV();

export const CookieStorage = {
  get(domain: string): Map<string, string> { ... },
  set(domain: string, key: string, value: string): void { ... },
  getAll(): Map<string, string> { ... },
  clear(): void { ... },
};
```

Cookie 按域名分区存储（`music.163.com`、`interface.music.163.com`），序列化为 JSON 字符串存入 MMKV。

### 5.3 服务层

每个 Service 文件封装一组相关的网易云 API 调用，内部负责加密、发送请求、解析响应。

**neteaseApi.ts** — 基础 API：

- `search(keyword)` — 歌曲搜索
- `getSongDetail(ids)` — 歌曲详情
- `getPlaylistTracks(playlistId)` — 歌单曲目
- `getToplist()` — 排行榜列表
- `getUserPlaylists(uid)` — 用户歌单
- `getLoginStatus()` — 登录状态
- `loginWithCookie(cookie)` — Cookie 登录验证

**sheetApi.ts** — 乐谱 API（从 api.bundle.js 的 SHEET_API 常量和相关函数提取）：

- `getSheets(songId)` — 获取歌曲乐谱列表
- `getSheetPreview(sheetId)` — 乐谱预览
- `getUploadPermission()` — 上传权限查询
- `uploadSheet(songId, key, pdfFile)` — 单曲上传
- `getUploadHint(songId)` — 上传奖励提示
- `getUploadedList()` — 已上传列表
- `updateSheet(sheetId, data)` — 更新乐谱
- `deleteSheet(sheetId)` — 删除乐谱
- `analyzeMusic(input, mode)` — 乐谱分析（链接/搜索/排行榜）

**ugcApi.ts** — 云小编 API：

- `sign()` / `getSignStatus()` — 签到
- `getOverview()` — UGC 概览
- `getDashboard()` — 仪表盘
- `getHonorRoll(type)` — 荣誉榜
- `getIntegrationRecords(filter)` — 积分明细
- `startExam()` / `getExamQuestion()` / `submitExam()` — 审核
- `getLotteryPool()` / `getLotteryChance()` / `drawLottery()` — 抽奖
- `getMallProducts()` — 商城商品

**qrLogin.ts** — 扫码登录：

- `getQrKey()` — 获取 unikey
- `checkQrStatus(key)` — 轮询扫码状态
- 返回的 key 用于 `QrCodeView` 组件本地渲染二维码

### 5.4 扫码登录

使用 `react-native-qrcode-svg` 在 APP 内本地渲染二维码，不再依赖外部 API。

流程：
1. 调用 `qrLogin.getQrKey()` 获取 unikey
2. 拼接 URL：`https://music.163.com/login?codekey={key}`
3. `QrCodeView` 组件用 `react-native-qrcode-svg` 渲染
4. `useQrPolling` Hook 每 3 秒调用 `checkQrStatus(key)`
5. code=803 时，将返回的 cookie 写入 `CookieStorage`，更新 `authStore`

### 5.5 批量上传

从扩展移植 `ccgqParse.ts` 和 `musicKey.ts`。

流程：
1. 用 `expo-document-picker` 选择 PDF 文件（支持多选）
2. `ccgqParse.ts` 从文件名解析 `{songId}_{歌名}_{调号}.pdf` 格式
3. 可选：通过 `batch-resolve` API 自动匹配未识别的歌曲 ID
4. 用户确认后逐个上传，可配置上传间隔（默认 3 秒，随机浮动）

## 6. 页面设计

### 底部导航四个 Tab

| Tab | 图标 | 页面 | 功能 |
|-----|------|------|------|
| 分析 | search | AnalyzeScreen | 搜索框 + 输入模式切换（链接/搜索/排行榜）+ 筛选器 + 结果列表 |
| 上传 | upload | UploadScreen | 单曲上传表单 + 批量上传入口 + 已上传列表 |
| 云小编 | star | UgcScreen | 签到卡片 + 积分概览 + 审核任务入口 + 抽奖 + 商城 + 榜单 |
| 我的 | person | ProfileScreen | 登录状态 + 扫码登录/Cookie登录入口 + Cookie 管理 + 设置 |

### 关键交互

- 未登录时：打开 APP 显示"我的"Tab，提示登录；乐谱分析和上传页面的操作按钮置灰
- 登录成功：自动跳转到分析页，底部显示用户头像
- 分析结果点击歌曲：跳转到 `AnalyzeDetailScreen`，显示乐谱列表，点击乐谱 PDF 跳转预览
- 批量上传：跳转 `BatchUploadScreen`，选择文件 → 解析 → 确认 → 上传进度条

## 7. 错误处理

- API 请求失败：Toast 提示具体错误信息，网络错误自动重试一次
- 二维码过期：遮罩覆盖二维码，显示"已过期"和刷新按钮
- Cookie 失效：检测到 401 时自动弹出登录提示
- 上传失败：记录失败的文件，支持单独重试

## 8. 从现有代码的复用清单

| 来源文件 | 复用内容 | 目标位置 |
|---------|---------|---------|
| Mine-Radio `eapi.js` | eapi 加密函数 | `src/crypto/eapi.ts` |
| Mine-Radio `weapi.js` | weapi 加密函数 | `src/crypto/weapi.ts` |
| Mine-Radio `vendor/crypto-es.mjs` | 加密库（替换为 crypto-js npm 包） | package.json 依赖 |
| 扩展 `qr-login.js` | 扫码登录 API 调用逻辑 | `src/services/qrLogin.ts` |
| 扩展 `app/ccgqParse.js` | ccgq 文件名解析 | `src/utils/ccgqParse.ts` |
| 扩展 `app/musicKey.js` | 调号工具函数 | `src/utils/musicKey.ts` |
| 扩展 `api.bundle.js` | SHEET_API 常量 + 乐谱上传/查询逻辑 | `src/services/sheetApi.ts` |
| 扩展 `api.bundle.js` | UGC API 路径和请求逻辑 | `src/services/ugcApi.ts` |
| 扩展 `api.bundle.js` | 歌曲搜索/歌单/排行榜逻辑 | `src/services/neteaseApi.ts` |

## 9. 不复用的部分

| 来源 | 原因 |
|------|------|
| `background.js` | 完全依赖 Chrome Extension API |
| `content-netease.js` / `content-local.js` | Chrome Content Script 注入逻辑 |
| `popup.html` / `popup.js` / `popup.css` | Chrome 扩展弹窗 UI |
| `app/index.html` + `app/app.js` + `app/style.css` | Web 页面 UI，用 RN 组件重写 |
| `api-shim.js` | 浏览器 fetch 劫持，RN 中不需要 |
| `shims/` | Node.js polyfill，RN 有自己的运行时 |
| `manifest.json` | Chrome 扩展清单 |
