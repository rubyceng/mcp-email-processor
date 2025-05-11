import { ParsedMail } from "mailparser";
import { ocrService } from "../services/ocr-service";
import { stripHtml } from "../utils/html-stripper";
import { logger } from "../utils/logger";

/**
 * 内容提取配置
 */
export interface SummarizationConfig {
  // 是否识别图片
  recognizeImages: boolean;
  // 图片识别策略：'ocr'（文本提取）或 'description'（图像描述）
  imageRecognitionStrategy: "ocr" | "description";
  // 其他配置选项...
}

/**
 * 提取结果
 */
export interface ExtractedContent {
  // 主要文本内容，用于总结
  mainText: string;
  // 图片相关内容（如果有）
  imageTexts?: string[];
  // 语言检测结果（可选）
  detectedLanguage?: string;
  // 其他元数据
  metadata?: Record<string, any>;
}

/**
 * 从解析后的邮件中提取内容
 * @param parsedMail 解析后的邮件对象
 * @param config 总结配置
 * @returns 提取的内容
 */
export async function extractContent(
  parsedMail: Partial<ParsedMail>,
  config: SummarizationConfig,
): Promise<ExtractedContent> {
  logger.info("开始提取邮件内容");
  let mainText = "";

  // 优先使用纯文本正文
  if (parsedMail.text && parsedMail.text.trim().length > 0) {
    mainText = parsedMail.text.trim();
  }
  // 如果纯文本为空或不足，处理HTML正文
  else if (parsedMail.html) {
    mainText = stripHtml(parsedMail.html);
  }

  const result: ExtractedContent = {
    mainText,
  };

  // 处理图片识别（如果配置要求）
  if (config.recognizeImages) {
    result.imageTexts = [];

    // 提取附件中的图片
    if (parsedMail.attachments && parsedMail.attachments.length > 0) {
      logger.info("提取附件中的图片");
      const imageAttachments = parsedMail?.attachments?.filter(
        (att) =>
          att.contentType &&
          att.contentType.startsWith("image/") &&
          (att.contentType.includes("png") ||
            att.contentType.includes("jpeg") ||
            att.contentType.includes("jpg")),
      );

      for (const img of imageAttachments) {
        // 调用OCR服务进行图片内容识别
        let imageText = "";
        if (config.imageRecognitionStrategy === "ocr" && img.content) {
          try {
            logger.info(`开始OCR识别图片: ${img.filename || "无文件名"}`);
            await ocrService.init();
            imageText = await ocrService.recognize(img.content);
            logger.info(`OCR识别成功: ${img.filename || "无文件名"}`);
          } catch (error) {
            logger.error(`OCR识别失败: ${img.filename || "无文件名"}`, {
              error,
            });
            imageText = `[图片内容识别失败: ${
              img.filename || "无文件名"
            } - OCR错误]`;
          }
        } else {
          imageText = `[图片描述功能暂未实现: ${img.filename || "无文件名"}]`;
        }
        result.imageTexts.push(imageText);
      }
    }

    // 提取HTML中的内嵌图片（例如CID链接或Base64编码）
    if (parsedMail.html) {
      // 简单的正则表达式检测img标签（实际应用中可能需要更复杂的解析）
      const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const matches = parsedMail.html.match(imgTagRegex);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          // 处理内嵌图片，暂不支持直接从HTML中提取图片数据
          const imageText = `[内嵌图片内容识别暂不支持: ${match.slice(
            0,
            50,
          )}... - ${config.imageRecognitionStrategy}]`;
          result.imageTexts.push(imageText);
        }
      }
    }

    // 如果有图片文本，将其附加到主文本后（或作为独立补充信息）
    if (result.imageTexts.length > 0) {
      result.mainText +=
        "\n\n--- 图片内容 ---\n" + result.imageTexts.join("\n");
    }
  }

  // 可选：语言检测（可以后续实现）
  result.detectedLanguage = "未检测";
  result.metadata = {
    source: "email",
    hasAttachments: parsedMail.attachments && parsedMail.attachments.length > 0,
    attachmentCount: parsedMail.attachments ? parsedMail.attachments.length : 0,
  };

  logger.info("邮件内容提取完成");
  return result;
}
