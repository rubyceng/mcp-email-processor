import { extractContent } from '../core/content-extractor';

describe('Content Extractor', () => {
  test('should extract content from plain text', async () => {
    const mockMail = { text: 'This is a plain text content.' };
    const config = {
      recognizeImages: false,
      imageRecognitionStrategy: 'ocr' as const,
    };
    const result = await extractContent(mockMail, config);
    expect(result.mainText).toBe('This is a plain text content.');
  });

  test('should handle empty content', async () => {
    const mockMail = { text: '' };
    const config = {
      recognizeImages: false,
      imageRecognitionStrategy: 'ocr' as const,
    };
    const result = await extractContent(mockMail, config);
    expect(result.mainText).toBe('');
  });
});
