# MCP Email Processor

## 英文说明

An MCP plugin for processing emails, summarizing content, and generating outlines.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/mcp-email-processor.git
   cd mcp-email-processor
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm run build
   ```

### Configuration

#### Environment Variables

Create a `.env` file in the project root directory with the following variables:

```
LOG_LEVEL=info
IMAP_HOST=imap.example.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=your-email@example.com
IMAP_PASS=your-password
```

#### Summarization Configuration

Edit `src/config.ts` to customize summarization options:

```typescript
export const summarizationConfig = {
  language: "en",
  summaryTargetLength: 100,
  outlineTargetPoints: 5,
  outlineStyle: "bullet",
  recognizeImages: false,
  imageRecognitionStrategy: "ocr" as const,
};
```

### Usage

#### CLI Commands

Run the application:

```bash
pnpm start
```

Run in development mode:

```bash
pnpm run dev
```

Run tests:

```bash
pnpm test
```

Lint and format code:

```bash
pnpm run lint
pnpm run format
```

### API Endpoints

Currently, the project operates as a CLI application. API endpoints will be added in future updates.

### Development

#### Code Style

This project uses ESLint for linting and Prettier for formatting. Pre-commit hooks are set up with Husky and Lint-Staged to ensure code quality.

#### Testing

Unit and integration tests are written with Jest. To add tests, place them in the `src/__tests__` directory.

### Security Considerations

- API keys and credentials are managed through environment variables and should never be hard-coded in the codebase.
- IMAP credentials are securely handled and should not be committed to version control.
- Data privacy: Be aware that email data may be sent to third-party NLP services for processing.

### Contributing

Contributions are welcome! Please follow the code style guidelines and submit pull requests for review.

### License

[Specify your license here]

---

# MCP邮件处理器

## 中文说明

一个用于处理邮件、总结内容和生成大纲的MCP插件。

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
LOG_LEVEL=info
IMAP_HOST=imap.example.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=your-email@example.com
IMAP_PASS=your-password
```

#### 总结配置

编辑`src/config.ts`以自定义总结选项：

```typescript
export const summarizationConfig = {
  language: "zh",
  summaryTargetLength: 100,
  outlineTargetPoints: 5,
  outlineStyle: "bullet",
  recognizeImages: false,
  imageRecognitionStrategy: "ocr" as const,
};
```

### 使用

#### 命令行工具命令

运行应用程序：

```bash
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

### API端点

目前，该项目作为命令行应用程序运行。API端点将在未来的更新中添加。

### 开发

#### 代码风格

该项目使用ESLint进行代码检查，使用Prettier进行格式化。使用Husky和Lint-Staged设置了预提交钩子以确保代码质量。

#### 测试

单元测试和集成测试使用Jest编写。要添加测试，请将它们放在`src/__tests__`目录中。

### 安全考虑

- API密钥和凭据通过环境变量管理，绝不应该在代码库中硬编码。
- IMAP凭据应安全处理，不应提交到版本控制中。
- 数据隐私：请注意，邮件数据可能会被发送到第三方NLP服务进行处理。

### 贡献

欢迎贡献！请遵循代码风格指南并提交拉取请求以供审查。

### 许可证

[在此指定您的许可证]
