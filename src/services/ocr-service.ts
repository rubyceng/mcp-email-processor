import { createWorker } from 'tesseract.js';
import { logger } from '../utils/logger';

/**
 * OCR服务类，用于处理图片内容的识别
 */
class OCRService {
  private worker: Tesseract.Worker | null = null;

  /**
   * 初始化OCR服务
   */
  async init(): Promise<void> {
    try {
      this.worker = await createWorker('eng');
      logger.info('OCR服务初始化成功');
    } catch (error) {
      logger.error('OCR服务初始化失败:', error);
      throw new Error('无法初始化OCR服务');
    }
  }

  /**
   * 识别图片中的文本
   * @param imageData 图片数据，可以是Buffer、文件路径或URL
   * @returns 识别出的文本
   */
  async recognize(imageData: Buffer | string): Promise<string> {
    if (!this.worker) {
      throw new Error('OCR服务未初始化');
    }

    try {
      const {
        data: { text },
      } = await this.worker.recognize(imageData);
      logger.info('图片内容识别成功');
      return text;
    } catch (error) {
      logger.error('图片内容识别失败:', error);
      throw new Error('图片内容识别过程中发生错误');
    }
  }

  /**
   * 终止OCR服务，释放资源
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      logger.info('OCR服务已终止');
    }
  }
}

export const ocrService = new OCRService();
