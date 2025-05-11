import { summarizer } from "../core/summarizer";

describe("Summarizer", () => {
  test("should summarize content", async () => {
    const content = "This is a long content that needs to be summarized.";
    const config = {
      language: "en",
      summaryTargetLength: 'short',
      outlineTargetPoints: 5,
      outlineStyle: "bullet",
      generateOutline: true
    };
    const result = await summarizer.summarizeAndOutline(content, config);
    expect(result.summary).toBeDefined();
    expect(result.outline).toBeDefined();
  });

  test("should handle empty content", async () => {
    const content = "";
    const config = {
      language: "en",
      summaryTargetLength: 'short',
      outlineTargetPoints: 5,
      outlineStyle: "bullet",
      generateOutline: true
    };
    await expect(
      summarizer.summarizeAndOutline(content, config)
    ).rejects.toThrow("总结和大纲生成失败");
  });
});
