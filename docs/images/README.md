# 项目截图说明

## 截图列表

以下截图需要在README.md中展示：

1. **dashboard.png** - 数据看板页面截图
   - 路径：访问 http://localhost:3000
   - 内容：展示数据看板的统计图表、设备状态分布等

2. **3d-visualization.png** - 3D机柜可视化页面截图
   - 路径：访问 http://localhost:3000/visualization-3d
   - 内容：展示3D机柜的三维视图、设备布局、交互功能

3. **device-management.png** - 设备管理页面截图
   - 路径：访问 http://localhost:3000/devices
   - 内容：展示设备列表、筛选功能、操作按钮等

4. **room-management.png** - 机房管理页面截图
   - 路径：访问 http://localhost:3000/rooms
   - 内容：展示机房列表、机柜统计、管理功能等

## 添加截图步骤

### Windows系统

1. **启动项目**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

2. **打开浏览器访问对应页面**

3. **使用截图工具**
   - Windows截图工具：Win + Shift + S
   - 或使用其他截图工具（如Snipaste、ShareX等）

4. **保存截图**
   - 将截图保存为PNG格式
   - 文件名对应上面的列表
   - 保存到 `docs/images/` 目录

5. **优化截图（可选）**
   - 建议分辨率：1920x1080 或更高
   - 建议压缩：使用TinyPNG等工具压缩图片大小
   - 建议格式：PNG（保持清晰度）或 WebP（更小体积）

### macOS系统

1. **启动项目**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

2. **打开浏览器访问对应页面**

3. **使用截图工具**
   - macOS截图工具：Cmd + Shift + 4（区域截图）
   - 或 Cmd + Shift + 3（全屏截图）

4. **保存截图**
   - 将截图保存为PNG格式
   - 文件名对应上面的列表
   - 保存到 `docs/images/` 目录

## 截图建议

### 最佳实践

- **浏览器全屏模式**：按F11进入全屏，避免浏览器UI干扰
- **隐藏开发者工具**：确保没有开发者工具面板
- **合适的窗口大小**：建议使用1920x1080或1366x768分辨率
- **数据准备**：确保页面有足够的测试数据展示
- **清晰度**：保持截图清晰，避免模糊

### 截图内容建议

- **数据看板**：展示多种图表类型、统计数据、关键指标
- **3D可视化**：展示机柜的3D视图、设备详情、交互状态
- **设备管理**：展示设备列表、搜索筛选、操作按钮
- **机房管理**：展示机房列表、机柜分布、统计信息

## 自动化截图（可选）

如果需要自动化截图，可以使用以下工具：

### Playwright

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 截图数据看板
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'docs/images/dashboard.png' });

  // 截图3D可视化
  await page.goto('http://localhost:3000/visualization-3d');
  await page.waitForTimeout(2000); // 等待3D场景加载
  await page.screenshot({ path: 'docs/images/3d-visualization.png' });

  await browser.close();
})();
```

### Puppeteer

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 截图数据看板
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'docs/images/dashboard.png' });

  await browser.close();
})();
```

## 注意事项

- 确保截图文件名与README.md中的引用一致
- 建议使用PNG格式以保持清晰度
- 截图大小建议控制在500KB以内
- 避免在截图中暴露敏感信息（如真实IP、密码等）
- 定期更新截图以反映最新的UI变化
