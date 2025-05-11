import { convert } from 'html-to-text';

/**
 * 将HTML内容转换为纯文本
 * @param html HTML字符串
 * @returns 纯文本内容
 */
export function stripHtml(html: string): string {
  if (!html) {
    return '';
  }

  const options = {
    wordwrap: 130,
    // 忽略脚本和样式
    ignoreHref: false,
    ignoreImage: false,
    // 保留换行
    preserveNewlines: true,
    // 移除多余空行
    singleNewLineParagraphs: true,
    // 表格处理
    tables: true,
    // 格式化选项
    formatters: {
      // 可以自定义格式化规则
    },
  };

  try {
    return convert(html, options);
  } catch (error) {
    console.error('HTML转换错误:', error);
    return '';
  }
}
