// AI Service for generating summaries
export interface AISummaryRequest {
  text: string;
  max_length?: number;
  temperature?: number;
}

export interface AISummaryResponse {
  summary: string;
  model: string;
  tokens_used: number;
}

export class AIService {
  private apiKey: string | null = null;
  private baseURL: string = 'https://api.openai.com/v1'; // Default to OpenAI

  constructor(apiKey?: string, baseURL?: string) {
    if (apiKey) this.apiKey = apiKey;
    if (baseURL) this.baseURL = baseURL;
  }

  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI service API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise summaries of collected text snippets. Focus on extracting key themes, insights, and important information.'
            },
            {
              role: 'user',
              content: `Please create a concise summary (max ${maxLength} words) of the following text collection:\n\n${text}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No summary generated.';
    } catch (error) {
      console.error('AI summary generation failed:', error);
      throw error;
    }
  }

  // Alternative: Use a simpler approach with a different AI service
  async generateSimpleSummary(text: string): Promise<string> {
    // Fallback implementation - you can replace this with your preferred AI service
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keySentences = sentences.slice(0, 3); // Simple extractive summary
    return keySentences.join('. ') + (keySentences.length > 0 ? '.' : 'No meaningful content to summarize.');
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }
}

// Singleton instance
export const aiService = new AIService();

// Initialize with environment variables if available
if (import.meta.env?.VITE_AI_API_KEY) {
  aiService.setApiKey(import.meta.env.VITE_AI_API_KEY);
}

if (import.meta.env?.VITE_AI_BASE_URL) {
  aiService.setBaseURL(import.meta.env.VITE_AI_BASE_URL);
}