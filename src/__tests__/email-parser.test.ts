import { parseEmail } from '../core/email-parser';

describe('Email Parser', () => {
  test('should parse email content correctly', async () => {
    const emailContent = 'Subject: Test Email\n\nThis is a test email content.';
    const result = await parseEmail(emailContent);
    expect(result.subject).toBe('Test Email');
    expect(result.text).toContain('This is a test email content');
  });

  test('should handle empty email content', async () => {
    const emailContent = '';
    await expect(parseEmail(emailContent)).rejects.toThrow(
      'Empty email content'
    );
  });
});
