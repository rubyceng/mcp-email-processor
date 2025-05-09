import { EmailFetcher } from "../core/email-fetcher";

describe("Email Fetcher", () => {
  test("should create EmailFetcher instance", () => {
    // 此测试需要mock IMAP或文件系统操作，实际实现时需要更复杂的设置
    const options = {
      host: "imap.example.com",
      port: 993,
      secure: true,
      auth: {
        user: "test@example.com",
        pass: "password",
      },
    };
    const fetcher = new EmailFetcher(options);
    expect(fetcher).toBeDefined();
  });
});
