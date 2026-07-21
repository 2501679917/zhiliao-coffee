# 知了 COFFEE

知了 COFFEE 的品牌展示与预约网站
https://6a5ed90249125feaedd5d5d1--harmonious-banoffee-6547fb.netlify.app/

## 设计与素材原则

- 网站只使用真实门店及饮品素材，不使用无关图库照片或人物照片。
- “知了”艺术标来自门店木牌实拍，保留真实笔画。
- 空间照片允许进行身份一致的构图、光线与清晰度优化，但不能虚构门店结构和陈设。
- 图片卡片支持鼠标悬停、指针景深、手机轻触、键盘操作和减少动态模式。

## 本地运行

需要 Python 3、FastAPI 和 Uvicorn。

```powershell
cd outputs/cafe-website/backend
python main.py
```

浏览器打开 [http://localhost:8000](http://localhost:8000)。前端预约请求使用相对路径 `/api/reservations`。

## 测试

在项目根目录运行：

```powershell
node --test outputs/cafe-website/tests/site.test.mjs
cd outputs/cafe-website/backend
python test_main.py
```

前端测试核对真实地址、营业时间、本地图片、菜单数据和交互模块；后端测试覆盖有效预约、历史日期、营业时间外预约、错误电话与人数边界。

## 项目结构

```text
outputs/cafe-website/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── data/menu.js
│   ├── images/
│   └── js/
├── backend/main.py
└── tests/site.test.mjs
```
