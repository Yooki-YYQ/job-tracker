// AI service for parsing job descriptions
import type { AIConfig, AIParseResult, ParsedJobData } from '@/types';
import { DEFAULT_AI_CONFIG } from '@/types';

// AI Configuration management
export const aiConfig = {
  get: (): AIConfig => {
    const stored = localStorage.getItem('ai-config');
    if (stored) {
      try {
        return { ...DEFAULT_AI_CONFIG, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_AI_CONFIG;
      }
    }
    return DEFAULT_AI_CONFIG;
  },

  set: (config: Partial<AIConfig>): void => {
    const current = aiConfig.get();
    const updated = { ...current, ...config };
    localStorage.setItem('ai-config', JSON.stringify(updated));
  },

  reset: (): void => {
    localStorage.removeItem('ai-config');
  }
};

// Parse job description with Google Gemini
async function parseWithGemini(jobDescription: string, apiKey: string): Promise<AIParseResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `Parse this job posting and extract: company, position, location, salary, job type, requirements. Return as JSON.\n\n${jobDescription}` 
            }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      return { success: false, error: 'Gemini API error' };
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Parse JSON from response
    const parsed = JSON.parse(text);
    
    return {
      success: true,
      data: {
        companyName: parsed.company,
        positionTitle: parsed.position,
        location: parsed.location,
        salary: parsed.salary,
        jobType: parsed.job_type,
        qualifications: parsed.requirements,
        status: 'APPLIED',
        confidence: 0.8
      }
    };
  } catch {
    return { success: false, error: 'Failed to parse with Gemini' };
  }
}

// Parse job description with AI
export async function parseJobWithAI(
  jobDescription: string,
  config?: Partial<AIConfig>
): Promise<AIParseResult> {
  const currentConfig = config ? { ...aiConfig.get(), ...config } : aiConfig.get();
  
  if (!currentConfig.apiKey) {
    // Try Gemini free tier first
    const geminiKey = localStorage.getItem('gemini_api_key');
    if (geminiKey) {
      return parseWithGemini(jobDescription, geminiKey);
    }
    
    // Fallback to mock
    return parseJobWithMock(jobDescription);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: currentConfig.model,
        temperature: currentConfig.temperature,
        messages: [
          {
            role: 'system',
            content: currentConfig.customPrompt
          },
          {
            role: 'user',
            content: jobDescription
          }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: 'No response from OpenAI API'
      };
    }

    // Parse the markdown table response
    const parsedData = parseMarkdownTable(content);
    
    return {
      success: true,
      data: parsedData,
      confidence: 0.8 // Default confidence
    };

  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Parse job description with mock data (for testing)
export async function parseJobWithMock(jobDescription: string): Promise<AIParseResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock parsing logic
  const mockData: ParsedJobData = {
    companyName: 'Mock Company',
    positionTitle: 'Software Developer',
    jobUrl: 'https://example.com/job',
    applicationDate: new Date().toISOString(),
    status: 'APPLIED',
    notes: 'Mock job description parsed',
    salary: '$80,000 - $100,000',
    location: 'Remote',
    jobType: 'Full-time',
    jobDescription: jobDescription.substring(0, 200) + '...',
    qualifications: 'Bachelor\'s degree in Computer Science or related field',
    confidence: 0.9
  };

  return {
    success: true,
    data: mockData,
    confidence: 0.9
  };
}

// Test AI connection
export async function testAIConnection(config: AIConfig): Promise<{ success: boolean; error?: string }> {
  if (!config.apiKey) {
    return { success: false, error: 'API key is required' };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Invalid API key or network error' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Helper function to parse markdown table
function parseMarkdownTable(content: string): ParsedJobData {
  const lines = content.split('\n').filter(line => line.trim());
  
  // Find table rows (lines with |)
  const tableRows = lines.filter(line => line.includes('|'));
  
  if (tableRows.length < 2) {
    // Fallback parsing if no table found
    return parseFallbackContent(content);
  }

  // Parse header and data rows
  const headerRow = tableRows[0];
  const dataRow = tableRows[1];
  
  const headers = headerRow.split('|').map(h => h.trim().toLowerCase());
  const values = dataRow.split('|').map(v => v.trim());
  
  const result: ParsedJobData = {
    companyName: '',
    positionTitle: '',
    status: 'APPLIED',
    confidence: 0.7
  };

  // Map values to fields
  headers.forEach((header, index) => {
    const value = values[index] || '';
    
    switch (header) {
      case 'position':
        result.positionTitle = value;
        break;
      case 'company':
        result.companyName = value;
        break;
      case 'location':
        result.location = value;
        break;
      case 'pay':
        result.salary = value;
        break;
      case 'job_type':
        result.jobType = value;
        break;
      case 'job_description':
        result.jobDescription = value;
        break;
      case 'qualifications':
        result.qualifications = value;
        break;
    }
  });

  return result;
}

// Fallback parsing for non-table responses
function parseFallbackContent(content: string): ParsedJobData {
  // Simple keyword extraction
  const companyMatch = content.match(/(?:company|employer)[:\s]+([^\n]+)/i);
  const positionMatch = content.match(/(?:position|title|role)[:\s]+([^\n]+)/i);
  const salaryMatch = content.match(/\$[\d,]+(?:-\$[\d,]+)?(?:\/year|\/hour)?/i);
  
  return {
    companyName: companyMatch?.[1]?.trim() || '',
    positionTitle: positionMatch?.[1]?.trim() || '',
    salary: salaryMatch?.[0] || '',
    status: 'APPLIED',
    jobDescription: content.substring(0, 500),
    confidence: 0.5
  };
}