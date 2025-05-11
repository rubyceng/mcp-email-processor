# MCP邮件处理器

## 中文文档

一个用于处理邮件、总结内容和生成大纲的MCP插件。

## 开发待办

1. 对接Gmail的IMAP服务
2. 开放自定义Prompt设置
3. 开发不同模型与推送的适配插件

### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/your-repo/mcp-email-processor.git
   cd mcp-email-processor
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 构建项目：
   ```bash
   pnpm run build
   ```

### 配置

#### 环境变量

在项目根目录下创建一个`.env`文件，包含以下变量：

```
OPENAI_API_KEY=YOUR_MODULE_APIKEY
BASE_URL=YOUR_MODULE_URL
MODULE_CONTEXT=YOUR_MODULE
# LOG_LEVEL=info
# IMAP_HOST=imap.example.com
# IMAP_PORT=993
# IMAP_SECURE=true
# IMAP_USER=your-email@example.com
# IMAP_PASS=your-password
```

#### 总结配置

编辑`src/config.ts`以自定义总结选项：

```typescript
export const summarizationConfig = {
  language: 'zh',
  summaryTargetLength: 100,
  outlineTargetPoints: 5,
  outlineStyle: 'bullet',
  recognizeImages: false,
  imageRecognitionStrategy: 'ocr' as const,
};
```

### 使用

#### 命令行工具命令

运行应用程序：

```bash
pnpm build
pnpm start
```

以开发模式运行：

```bash
pnpm run dev
```

运行测试：

```bash
pnpm test
```

代码检查和格式化：

```bash
pnpm run lint
pnpm run format
```

##### 处理命令

处理手动输入的邮件内容或文件：

```bash
pnpm start process <input>
```

- `<input>`：要处理的邮件内容或文件路径。

**选项：**

- `-l, --language <language>`：总结语言（默认："zh"）。
- `-s, --summary-length <length>`：总结目标长度（默认："medium"）。
- `-g, --outline`：是否生成大纲（默认：false）。
- `-o, --outline-points <points>`：大纲目标点数（默认："3"）。
- `-t, --outline-style <style>`：大纲样式（默认："bullet"）。
- `-i, --recognize-images`：是否识别图片内容（默认：false）。
- `-r, --recognition-strategy <strategy>`：图片识别策略（默认："ocr"）。

### API端点

目前，该项目作为命令行应用程序运行。API端点将在未来的更新中添加。

### 开发

#### 代码风格

该项目使用ESLint进行代码检查，使用Prettier进行格式化。使用Husky和Lint-Staged设置了预提交钩子以确保代码质量。

#### 测试

单元测试和集成测试使用Jest编写。要添加测试，请将它们放在`src/__tests__`目录中。

### 安全

- IMAP凭据应安全处理，不应提交到版本控制中。
- 数据隐私：请注意，邮件数据可能会被发送到第三方NLP服务进行处理。

### 贡献

欢迎贡献！请遵循代码风格指南并提交拉取请求以供审查。

### 许可证

[Apache 2.0 © 2025 Ruby Ceng, Inc.](./LICENSE)
