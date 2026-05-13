# 掘金课程小册

本项目按照作业要求使用 `Webpack + React + TypeScript + Tailwind CSS` 搭建，不使用 `CRA`，并集成了：

- `ESLint`
- `Prettier`
- `Husky`
- `Commitlint`

项目目标是还原掘金课程页中指定区域，并完成课程切换、分类切换、排序、筛选、真实接口请求与本地构建验收流程。

## 功能说明

### 1. 课程切换

页面顶部提供两个课程入口：

- `掘金小册`
- `字节内部课`

点击不同课程按钮后，可以切换到对应课程页面。

### 2. 分类切换

两个课程页都支持分类切换，分类数据来自真实接口。

- `掘金小册`：显示小册分类
- `字节内部课`：显示字节内部课分类

### 3. 掘金小册页面

掘金小册页面实现了题目要求中的完整交互：

- 分类切换
- `全部 / 最新 / 热销 / 价格` 排序切换
- 价格支持：
  - 从高到低
  - 从低到高
- 默认价格排序为从高到低
- 从价格页切换到其他页时，点击一次即可正确切换
- 支持 `只看VIP课程` 筛选

### 4. 字节内部课页面

字节内部课页面按照当前作业要求与参考截图单独处理：

- 支持课程切换
- 支持分类切换
- 不显示 `全部 / 最新 / 热销 / 价格` 排序栏
- 不显示 `只看VIP课程`
- 卡片样式按字节内部课页面单独还原

## 数据来源

页面数据直接来自掘金真实接口。

### 分类接口

```text
POST https://api.juejin.cn/booklet_api/v1/course/course_category_list?aid=2608&uuid=7618932798380197426&spider=0
body: { "show_type": 2 }
```

返回内容包含：

- `booklet_categories`
- `bytecourse_categories`

### 掘金小册列表接口

```text
POST https://api.juejin.cn/booklet_api/v1/booklet/listbycategory?aid=2608&uuid=7618932798380197426&spider=0
```

当前项目中使用到的排序映射如下：

- `全部` -> `sort = 0`
- `最新` -> `sort = 10`
- `热销` -> `sort = 7`
- `价格从高到低` -> `sort = 9`
- `价格从低到高` -> `sort = 8`

### 字节内部课列表接口

```text
GET https://api.juejin.cn/booklet_api/v1/bytecourse/list_by_category?category_id=...&cursor=0&page_size=20&aid=2608&uuid=7618932798380197426&spider=0
```

## 技术实现

### 工程能力

- 使用 `Webpack 5` 手动搭建工程
- 使用 `React 18`
- 使用 `TypeScript 5`
- 使用 `Tailwind CSS 3`
- 配置 `ESLint + Prettier`
- 配置 `Husky + lint-staged`
- 配置 `Commitlint`

### 页面结构

项目重点文件如下：

- `src/App.tsx`
  页面主状态入口，负责课程切换、分类切换、排序切换、VIP 筛选、列表加载与错误状态展示。

- `src/lib/courseService.ts`
  负责真实接口请求、分类数据处理、课程卡片数据映射。

- `src/components/CourseCard.tsx`
  负责两类课程卡片的展示：

  - 掘金小册卡片
  - 字节内部课卡片

- `src/components/CoverThumb.tsx`
  负责课程封面展示。

- `src/lib/format.ts`
  负责价格、时长、数量等格式化逻辑。

- `src/lib/sortCourses.ts`
  负责列表排序相关逻辑。

- `src/styles/index.css`
  负责页面全局样式补充与细节调整。

## 运行方式

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 构建生产文件

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 自动修复格式

```bash
npm run format
```

## Whistle 配置

按照老师验收方式，需要在浏览器中通过 Whistle 代理真实接口请求。

### 启动 Whistle

```bash
w2 start
```

Whistle 面板地址通常为：

```text
http://127.0.0.1:8899
```

### Rules 配置

在 Whistle 的 `Rules` 页面中加入：

```yaml
api.juejin.cn reqCors://https://e.juejin.cn
api.juejin.cn resCors://*
```

### 浏览器代理

浏览器代理到：

```text
127.0.0.1:8899
```

## 验收流程

老师验收时可按以下流程操作：

1. 在项目目录执行：

```bash
npm run build
```

2. 使用 VS Code 的 `Live Server` 打开：

```text
dist/index.html
```

3. 浏览器代理到 Whistle `8899`

4. 检查页面功能与还原效果：

- 课程切换
- 分类切换
- 小册页排序
- 小册页价格升降序
- 小册页 VIP 筛选
- 字节内部课页面独立样式

## 提交说明

建议提交源码与配置文件，不提交构建产物与依赖目录。

`.gitignore` 中已处理常见忽略项，包括：

- `node_modules`
- `dist`

## 脚本列表

当前项目可用脚本如下：

```bash
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run format
npm run prepare
```
