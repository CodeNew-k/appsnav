# 星叶导航 · 静态站点

按用途整理的应用导航站，纯静态、无后端、无框架依赖。整站 32 个页面，21 个工具条目，每条都有独立的使用说明与 TKD。

## 目录结构

```
appsnav/
├── index.html            首页（分类总览、搜索筛选、编辑推荐、站点说明）
├── category/
│   ├── ai-chat.html      AI 对话与写作
│   ├── ai-media.html     AI 绘画与影音
│   ├── game.html         游戏与娱乐
│   └── tools.html        效率与工具
├── tools/                21 个工具详情页，一页一条目
├── about.html            关于我们（收录标准、编辑流程）
├── submit.html           提交收录（表单生成邮件，无需后端）
├── disclaimer.html       免责声明
├── privacy.html          隐私政策
├── copyright.html        版权声明
├── 404.html              错误页
├── assets/
│   ├── style.css         全站样式（单文件，含响应式）
│   └── main.js           仅两件事：首页筛选、提交表单拼邮件
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## 本地预览

在 `appsnav` 目录下执行：

```bash
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000`。直接双击 HTML 也能看，但用本地服务更接近线上环境。

## 部署

- **GitHub Pages**：把整个 `appsnav` 目录推到仓库，Settings → Pages 选择分支根目录即可。
- **Cloudflare Pages / Netlify**：上传目录，构建命令留空，输出目录填 `/`。
- **宝塔 / Nginx**：把目录内容放到站点根目录，无需伪静态规则。

`404.html` 里的站内链接用的是根路径（`/index.html`），适合部署在独立域名根目录。如果部署在子路径（如 `example.com/appsnav/`），把这三处改成相对路径。

## 上线前要改的地方

1. **域名**：全站 canonical、og:url、sitemap 里都是 `https://www.appsnav.com`。换域名时在 `site_src/build.py` 改 `SITE_DOMAIN` 后重新生成，或直接全局替换 `https://www.appsnav.com`。
2. **邮箱**：`admin@appsnav.com` 出现在页脚、提交页、三个条款页与 `assets/main.js` 的 mailto 里，一并替换。
3. **统计代码**：如需接入统计，把脚本加到 `build.py` 的 `shell()` 模板里，避免逐页手改。

## 内容维护

每条工具的内容都写死在对应 `tools/xxx.html` 的正文里，TKD 在文件头部：

```html
<title>…</title>
<meta name="description" content="…">
<meta name="keywords" content="…">
<link rel="canonical" href="…">
```

新增一个条目，要么照现有页面复制一份改内容，要么用配套的生成脚本：

```
site_src/
├── build.py            渲染器（模板、TKD、结构化数据、sitemap）
├── data_common.py      站点常量与分类定义
├── tools_chat.py       AI 对话与写作
├── tools_media.py      AI 绘画与影音
├── tools_game.py       游戏与娱乐
├── tools_util.py       效率与工具
├── tools_extra.py      补充条目
├── style.css
└── main.js
```

在对应的 `tools_*.py` 里加一条字典，运行 `python3 build.py`，整站（含首页卡片、分类页、sitemap）会一起更新。

## 这一版针对原稿修的地方

- 原先详情页的 TDK 由 JS 在页面加载后改写，爬虫拿到的永远是同一套通用标题；现在 32 个页面全部静态输出，标题、描述、关键词、canonical 各页独立。
- 原先首页的导航和卡片由 JS 渲染，源码里几乎没有可抓取的链接；现在卡片是静态 `<a>`，正文不依赖脚本。
- 原先侧栏 `position: fixed` 配页脚 `margin-left` 硬挤，移动端侧栏被 `translateX(-100%)` 隐藏且没有唤出入口；现在用网格布局 + `position: sticky`，窄屏自动变成可换行的分类胶囊。
- 原先资料卡用 1px 间隙模拟边框，条目数是奇数时右下角会空出一块灰格；现在每个格子独立描边，奇数也不会露空。
- 原先卡片描述只给一行、名称强制单行省略，长名字会被切；现在两到三行自适应，窄屏单列。
- 数量从 7 条扩到 21 条，分类从 3 个到 4 个，每条详情页 1600–2400 字，含能力拆解、上手步骤、适合/不适合、横向对比、FAQ。
- 页脚原来三个法律链接全指向免责声明；现在免责、隐私、版权各自成页。
