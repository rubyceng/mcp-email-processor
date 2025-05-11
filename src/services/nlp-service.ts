import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// 加载环境变量
dotenv.config();

// OpenAI 客户端初始化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
});

/**
 * NLP 服务接口，用于调用 OpenAI API 进行文本总结和大纲生成
 */
export class NLPService {
  /**
   * 生成文本总结
   * @param text 待总结的文本内容
   * @param language 目标语言
   * @param summaryTargetLength 期望的摘要长度（词数）
   * @returns 总结文本
   */
  async generateSummary(
    text: string,
    language: string,
    summaryTargetLength: string
  ): Promise<string> {
    try {
      const prompt = this.buildSummaryPrompt(
        text,
        language,
        summaryTargetLength
      );
      const response = await openai.chat.completions.create({
        model: process.env.MODULE_CONTEXT || 'grok-3-beta',
        messages: [{ role: 'user', content: prompt }],
        // max_tokens: summaryTargetLength * 2, // 粗略估计词数对应的 token 数
        temperature: 0.5,
      });

      const summary = response.choices[0].message.content?.trim() || '';
      return summary;
    } catch (error) {
      this.handleError(error, '生成总结');
      throw new Error(
        `生成总结失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  /**
   * 生成文本大纲
   * @param text 待生成大纲的文本内容
   * @param language 目标语言
   * @param outlineTargetPoints 期望的大纲点数
   * @param outlineStyle 大纲风格
   * @returns 大纲文本
   */
  async generateOutline(
    text: string,
    language: string,
    outlineTargetPoints: number,
    outlineStyle: string
  ): Promise<string> {
    try {
      const prompt = this.buildOutlinePrompt(
        text,
        language,
        outlineTargetPoints,
        outlineStyle
      );
      const response = await openai.chat.completions.create({
        model: process.env.MODULE_CONTEXT || 'grok-3-beta',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: outlineTargetPoints * 50, // 粗略估计每个大纲点对应的 token 数
        temperature: 0.5,
      });

      const outline = response.choices[0].message.content?.trim() || '';
      return outline;
    } catch (error) {
      this.handleError(error, '生成大纲');
      throw new Error(
        `生成大纲失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  /**
   * 构建总结请求的提示
   * @param text 文本内容
   * @param language 目标语言
   * @param summaryTargetLength 期望的摘要长度
   * @returns 提示字符串
   */
  private buildSummaryPrompt(
    text: string,
    language: string,
    summaryTargetLength: string
  ): string {
    return `
      请将以下文本总结为 ${summaryTargetLength} 摘要，使用 ${language} 语言：
      "${text}"
    `;
  }

  /**
   * 构建大纲请求的提示
   * @param text 文本内容
   * @param language 目标语言
   * @param outlineTargetPoints 期望的大纲点数
   * @param outlineStyle 大纲风格
   * @returns 提示字符串
   */
  private buildOutlinePrompt(
    text: string,
    language: string,
    outlineTargetPoints: number,
    outlineStyle: string
  ): string {
    return `
      请为以下文本生成一个包含大约 ${outlineTargetPoints} 个要点的${outlineStyle}风格大纲，使用 ${language} 语言：
      "${text}"
    `;
  }

  /**
   * 处理 API 调用错误
   * @param error 错误对象
   * @param operation 操作描述
   */
  private handleError(error: unknown, operation: string): void {
    if (error instanceof OpenAI.APIError) {
      console.error(`${operation} 时发生 OpenAI API 错误:`, {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
    } else {
      console.error(`${operation} 时发生未知错误:`, error);
    }
  }
}

// 导出 NLP 服务实例
export const nlpService = new NLPService();
