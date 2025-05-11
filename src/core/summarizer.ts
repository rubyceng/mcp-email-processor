import { nlpService } from "../services/nlp-service";
import { logger } from "../utils/logger";

/**
 * 总结配置接口
 */
export interface SummarizationConfig {
  language: string;
  summaryTargetLength: string;
  outlineTargetPoints: number;
  outlineStyle: string;
  generateOutline: boolean;
}

/**
 * 总结结果接口
 */
export interface SummarizationResult {
  summary: string;
  outline: string;
}

/**
 * 总结器类，用于处理文本内容的总结和大纲生成
 */
export class Summarizer {
  /**
   * 生成文本的总结和大纲
   * @param text 待处理的文本内容
   * @param config 总结配置
   * @returns 包含总结和大纲的结果对象
   */
  async summarizeAndOutline(
    text: string,
    config: SummarizationConfig,
  ): Promise<SummarizationResult> {
    try {
      logger.info("开始生成文本总结和大纲");
        if (!text||text.length == 0 )
        {
          throw new Error("文本内容为空");
        }
      // 调用 NLP 服务生成总结
      const summary = await nlpService.generateSummary(
        text,
        config.language,
        config.summaryTargetLength,
      );

      // 调用 NLP 服务生成大纲
      if (!config.generateOutline) {
        return {
          summary,
          outline: "",
        };
      }
      const outline = await nlpService.generateOutline(
        text,
        config.language,
        config.outlineTargetPoints,
        config.outlineStyle,
      );

      // 返回结构化结果
      logger.info("文本总结和大纲生成成功");
      return {
        summary,
        outline,
      };
    } catch (error) {
      logger.error("总结和大纲生成过程中发生错误", { error });
      throw new Error(
        `总结和大纲生成失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
      );
    }
  }
}

// 导出总结器实例
export const summarizer = new Summarizer();
