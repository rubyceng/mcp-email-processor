import dotenv from 'dotenv';
import { SummarizationConfig } from './interfaces';

// 加载环境变量
dotenv.config();

/**
 * 默认的邮件总结配置
 */
export const defaultSummarizationConfig: SummarizationConfig = {
  language: 'auto',
  summaryTargetLength: 'medium',
  outlineTargetPoints: 5,
  outlineStyle: 'bullet',
  recognizeImages: false,
  tonePreference: 'professional',
};

/**
 * 从环境变量获取API密钥
 */
export const apiKeys = {
  nlpService: process.env.NLP_SERVICE_API_KEY || '',
};

/**
 * 应用配置
 */
export const appConfig = {
  // 应用名称
  name: 'mcp-email-processor',

  // 版本号
  version: '1.0.0',

  // 日志级别
  logLevel: process.env.LOG_LEVEL || 'info',

  // 邮件获取间隔（分钟）
  fetchInterval: parseInt(process.env.FETCH_INTERVAL || '5', 10),
};
