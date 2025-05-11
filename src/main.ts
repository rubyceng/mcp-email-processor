import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import { ParsedMail } from "mailparser";
import { extractContent } from "./core/content-extractor";
import { EmailFetcher } from "./core/email-fetcher";
import { parseEmail } from "./core/email-parser";
import { summarizer } from "./core/summarizer";
import { SummarizationConfig } from "./interfaces/index";
import { logger } from "./utils/logger";

// 加载环境变量
dotenv.config();

// 初始化commander
const program = new Command();
program
  .name("mcp-email-processor")
  .description("邮件处理mcp插件，用于读取邮件、总结内容并生成大纲")
  .version("1.0.0");

// 处理手动输入的邮件
program
  .command("process")
  .description("处理手动输入的邮件内容或文件")
  .argument("<input>", "邮件内容或文件路径")
  .option("-l, --language <language>", "总结语言", "zh")
  .option("-s, --summary-length <length>", "总结目标长度", "medium")
  .option("-g --outline", "是否生成大纲", false)
  .option("-o, --outline-points <points>", "大纲目标点数", "3")
  .option("-t, --outline-style <style>", "大纲样式", "bullet")
  .option("-i, --recognize-images", "是否识别图片内容", false)
  .option("-r, --recognition-strategy <strategy>", "图片识别策略", "ocr")
  .allowExcessArguments(true)
  .action(async (input, options) => {
    try {
      await processManualEmail(input, {
        language: options.language,
        summaryTargetLength: options.summaryLength,
        generateOutline: options.outline,
        outlineTargetPoints: parseInt(options.outlinePoints),
        outlineStyle: options.outlineStyle,
        recognizeImages: options.recognizeImages,
        imageRecognitionStrategy:options.recognitionStrategy  ,
        tonePreference: "formal",
      });
    } catch (error) {
      logger.error("处理邮件时出错:", error);
      console.error("错误:", (error as Error).message);
      process.exit(1);
    }
  });

// 通过IMAP获取并处理邮件
// program
//   .command("imap")
//   .description("通过IMAP获取并处理邮件")
//   .option("-h, --host <host>", "IMAP主机", process.env.IMAP_HOST || "")
//   .option("-p, --port <port>", "IMAP端口", process.env.IMAP_PORT || "993")
//   .option("-u, --user <user>", "IMAP用户名", process.env.IMAP_USER || "")
//   .option("-w, --pass <pass>", "IMAP密码", process.env.IMAP_PASS || "")
//   .option(
//     "-s, --secure",
//     "是否使用安全连接",
//     process.env.IMAP_SECURE === "true"
//   )
//   .option("-l, --limit <limit>", "获取邮件数量限制", "5")
//   .option("-g, --language <language>", "总结语言", "zh")
//   .option("-m, --summary-length <length>", "总结目标长度", "medium")
//   .option("-o, --outline-points <points>", "大纲目标点数", "5")
//   .option("-s, --outline-style <style>", "大纲样式", "bullet")
//   .option("-i, --recognize-images", "是否识别图片内容", false)
//   .option("-r, --recognition-strategy <strategy>", "图片识别策略", "ocr")
//   .action(async (options) => {
//     try {
//       if (!options.host || !options.port || !options.user || !options.pass) {
//         throw new Error("IMAP配置未完整提供");
//       }
//       await processImapEmails(
//         {
//           host: options.host,
//           port: parseInt(options.port),
//           secure: options.secure,
//           auth: {
//             user: options.user,
//             pass: options.pass,
//           },
//           limit: parseInt(options.limit),
//         },
//         {
//           language: options.language,
//           summaryTargetLength: options.summaryLength,
//           outlineTargetPoints: parseInt(options.outlinePoints),
//           outlineStyle: options.outlineStyle,
//           recognizeImages: options.recognizeImages,
//           imageRecognitionStrategy:
//             options.recognitionStrategy === "captioning"
//               ? "description"
//               : options.recognitionStrategy,
//           tonePreference: "formal",
//         }
//       );
//     } catch (error) {
//       logger.error("处理IMAP邮件时出错:", error);
//       console.error("错误:", (error as Error).message);
//       process.exit(1);
//     }
//   });

async function processManualEmail(input: string, config: SummarizationConfig) {
  try {
    let emailContent: string;

    // 检查输入是否为文件路径
    if (fs.existsSync(input)) {
      emailContent = fs.readFileSync(input, "utf-8");
      logger.info(`从文件读取邮件内容: ${input}`);
    } else {
      emailContent = input;
      logger.info("从输入字符串读取邮件内容");
    }

    // 解析邮件
    const parsedEmailPartial = await parseEmail(emailContent);
    logger.info("邮件解析完成");

    // 确保parsedEmail包含所有必要属性
    const parsedEmail: Partial<ParsedMail> = {
      from: parsedEmailPartial.from,
      to: parsedEmailPartial.to || [],
      subject: parsedEmailPartial.subject || "",
      date: parsedEmailPartial.date || new Date(),
      text: parsedEmailPartial.text || "",
      html: parsedEmailPartial.html || "",
      attachments: parsedEmailPartial.attachments || [],
    };

    // 提取内容
    const content = await extractContent(parsedEmail, {
      recognizeImages: config.recognizeImages,
      imageRecognitionStrategy:
        config.imageRecognitionStrategy === "captioning"
          ? "description"
          : (config.imageRecognitionStrategy as "ocr" | "description"),
    });
    logger.info("内容提取完成");

    // 总结内容并生成大纲
    const result = await summarizer.summarizeAndOutline(content.mainText, {
      language: config.language,
      summaryTargetLength: config.summaryTargetLength ?? 'short',
      outlineTargetPoints: Number(config.outlineTargetPoints),
      outlineStyle: config.outlineStyle ?? "20",
      generateOutline: config.generateOutline ?? false,
    });
    logger.info("内容总结完成");

    // 处理邮件基本信息输出，确保处理undefined情况
    const fromText = parsedEmail.from
      ? typeof parsedEmail.from === "string"
        ? parsedEmail.from
        : parsedEmail.from?.text || "未知"
      : "未知";
    const subjectText = parsedEmail.subject || "无主题";
    const dateText = parsedEmail.date ? parsedEmail.date?.toISOString() : "未知";

    console.log("邮件基本信息:");
    console.log(`  发件人: ${fromText}`);
    console.log(`  主题: ${subjectText}`);
    console.log(`  日期: ${dateText}`);
    console.log("邮件总结:", result.summary);
    if(result.outline.length >0){
      console.log("大纲:",result.outline);
    }
    return result;
  } catch (error: unknown) {
    logger.error("处理邮件时出错:", error);
    throw new Error(`处理邮件失败: ${(error as Error).message}`);
  }
}

async function processImapEmails(
  imapConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    limit: number;
  },
  config: SummarizationConfig
) {
  const fetcher = new EmailFetcher({
    host: imapConfig.host,
    port: imapConfig.port,
    secure: imapConfig.secure,
    auth: {
      user: imapConfig.auth.user,
      pass: imapConfig.auth.pass,
    },
  });

  try {
    await fetcher.connect();
    const mailboxes = await fetcher.listMailboxes();
    logger.info("邮箱列表:", mailboxes);

    // 默认选择INBOX
    await fetcher.selectMailbox("INBOX");

    // 获取最近的邮件
    const emailUids = await fetcher.searchEmails({ limit: imapConfig.limit });
    logger.info("找到的邮件UID:", emailUids);

    for (const uid of emailUids) {
      const emailContent = await fetcher.fetchEmail(uid);
      logger.info(`处理邮件UID: ${uid}`);
      await processManualEmail(emailContent, config);
    }

    await fetcher.close();
  } catch (error: unknown) {
    logger.error("处理IMAP邮件时出错:", error);
    throw new Error(`处理IMAP邮件失败: ${(error as Error).message}`);
  }
}

// 解析命令行参数并执行
program.parse(process.argv);

// 如果没有命令被执行，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
