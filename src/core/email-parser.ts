import { ParsedMail, simpleParser } from 'mailparser';
import { logger } from '../utils/logger';

/**
 * 解析原始邮件内容并返回结构化的邮件对象
 * @param rawEmail 原始邮件内容，可以是字符串或Buffer
 * @returns Promise<Partial<ParsedMail>> 返回结构化的邮件对象
 * @throws 解析过程中的错误
 */
export async function parseEmail(
  rawEmail: string | Buffer
): Promise<Partial<ParsedMail>> {
  try {
    logger.info('开始解析邮件内容');
    const parsed = await simpleParser(rawEmail);
    logger.info('邮件内容解析成功');

    // 提取所需字段，构建简洁的邮件对象
    const emailData: Partial<ParsedMail> = {
      from: parsed.from,
      to: parsed.to,
      cc: parsed.cc,
      subject: parsed.subject,
      date: parsed.date,
      text: parsed.text,
      html: parsed.html,
      attachments: parsed.attachments,
    };

    return emailData;
  } catch (error) {
    logger.error('邮件解析失败', { error });
    throw new Error(
      `邮件解析失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 获取邮件正文的最佳文本版本
 * @param email 解析后的邮件对象
 * @returns string 最佳文本版本的正文
 */
export function getBestTextContent(email: Partial<ParsedMail>): string {
  // 优先返回纯文本正文，如果没有则尝试从HTML正文中提取
  if (email.text) {
    return email.text;
  } else if (email.html) {
    // 简单的HTML到文本转换，实际项目中可能需要更复杂的处理
    return email.html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return '';
}

/**
 * 检查邮件是否有附件
 * @param email 解析后的邮件对象
 * @returns boolean 是否有附件
 */
export function hasAttachments(email: Partial<ParsedMail>): boolean {
  return !!email.attachments && email.attachments.length > 0;
}
