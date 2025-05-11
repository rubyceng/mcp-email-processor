/**
 * 邮件总结配置接口
 * 定义了邮件总结和大纲生成的配置选项
 */
export interface SummarizationConfig {
  /**
   * 总结和大纲的语言
   * 'en' - 英文, 'zh' - 中文, 'auto' - 自动检测
   */
  language: "en" | "zh" | "auto";

  /**
   * 总结的目标长度
   * 'short' - 简短, 'medium' - 中等, 'long' - 详细
   */
  summaryTargetLength?: "short" | "medium" | "long";

  /**
   * 是否生成大纲
   */
  generateOutline?: boolean;

  /**
   * 大纲的目标要点数量
   */
  outlineTargetPoints?: number;

  /**
   * 大纲的样式
   * 'bullet' - 项目符号, 'numbered' - 编号, 'paragraph' - 段落
   */
  outlineStyle?: "bullet" | "numbered" | "paragraph";

  /**
   * 是否识别邮件中的图像内容
   */
  recognizeImages: boolean;

  /**
   * 图像识别策略
   * 'ocr' - 光学字符识别, 'captioning' - 图像描述生成
   * 仅当 recognizeImages 为 true 时有效
   */
  imageRecognitionStrategy?: "ocr" | "captioning";

  /**
   * 语气偏好
   * 'formal' - 正式, 'casual' - 随意, 'professional' - 专业
   */
  tonePreference?: "formal" | "casual" | "professional";
}

/**
 * 简化版的解析后的邮件结构
 * 用于在模块间传递邮件数据
 */
export interface SimplifiedParsedMail {
  /**
   * 邮件唯一标识符
   */
  id: string;

  /**
   * 发件人
   */
  from: string;

  /**
   * 收件人
   */
  to: string[];

  /**
   * 邮件主题
   */
  subject: string;

  /**
   * 邮件正文文本内容
   */
  text: string;

  /**
   * 邮件正文HTML内容（如果有）
   */
  html?: string;

  /**
   * 邮件发送日期
   */
  date: Date;
}

/**
 * API响应通用结构
 */
export interface ApiResponse<T> {
  /**
   * 请求是否成功
   */
  success: boolean;

  /**
   * 响应数据
   */
  data?: T;

  /**
   * 错误信息（如果请求失败）
   */
  error?: string;
}
