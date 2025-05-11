import { ImapFlow } from 'imapflow';
import { logger } from '../utils/logger';

export interface EmailFetcherOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
    accessToken?: string;
  };
}

export class EmailFetcher {
  private client: ImapFlow;

  constructor(options: EmailFetcherOptions) {
    this.client = new ImapFlow({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth: {
        user: options.auth.user,
        pass: options.auth.pass,
        accessToken: options.auth.accessToken,
      },
      logger: {
        debug: (msg) => logger.debug(msg),
        info: (msg) => logger.info(msg),
        warn: (msg) => logger.warn(msg),
        error: (msg) => logger.error(msg),
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('IMAP connection established');
    } catch (error: unknown) {
      logger.error('Failed to connect to IMAP server:', error);
      throw new Error(`IMAP connection failed: ${(error as Error).message}`);
    }
  }

  async listMailboxes(): Promise<string[]> {
    try {
      const mailboxes = await this.client.list();
      return mailboxes.map((mb) => mb.path);
    } catch (error: unknown) {
      logger.error('Failed to list mailboxes:', error);
      throw new Error(`Failed to list mailboxes: ${(error as Error).message}`);
    }
  }

  async selectMailbox(mailbox: string): Promise<void> {
    try {
      await this.client.mailboxOpen(mailbox);
      logger.info(`Mailbox ${mailbox} selected`);
    } catch (error: unknown) {
      logger.error(`Failed to select mailbox ${mailbox}:`, error);
      throw new Error(`Failed to select mailbox: ${(error as Error).message}`);
    }
  }

  async searchEmails(criteria: {
    since?: Date;
    unseen?: boolean;
    limit?: number;
  }): Promise<number[]> {
    try {
      const query: any = {};
      if (criteria.since) query.since = criteria.since;
      if (criteria.unseen) query.unseen = true;

      const messages = await this.client.search(query);
      if (criteria.limit) {
        return messages.slice(-criteria.limit);
      }
      return messages;
    } catch (error: unknown) {
      logger.error('Failed to search emails:', error);
      throw new Error(`Failed to search emails: ${(error as Error).message}`);
    }
  }

  async fetchEmail(uid: number): Promise<string> {
    try {
      const message = await this.client.fetchOne(uid.toString(), {
        source: true,
      });
      if (message.source) {
        return message.source.toString();
      } else {
        throw new Error(`Source not available for email with UID ${uid}`);
      }
    } catch (error: unknown) {
      logger.error(`Failed to fetch email with UID ${uid}:`, error);
      throw new Error(`Failed to fetch email: ${(error as Error).message}`);
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.logout();
      logger.info('IMAP connection closed');
    } catch (error: unknown) {
      logger.error('Failed to close IMAP connection:', error);
      throw new Error(
        `Failed to close IMAP connection: ${(error as Error).message}`
      );
    }
  }
}
