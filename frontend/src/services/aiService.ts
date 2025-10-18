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

// Parse job description with smart extraction (no API needed)
export async function parseJobWithMock(jobDescription: string): Promise<AIParseResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Smart extraction logic using regex patterns
  const extractCompany = (text: string): string => {
    // Look for company names in various patterns
    const patterns = [
      /(?:at|for|with)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|$)/i,
      /([A-Z][a-zA-Z\s&]+?)\s+(?:is looking|seeks|hiring|recruiting)/i,
      /(?:join|work at)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|$)/i,
      /([A-Z][a-zA-Z\s&]+?)\s+(?:University|College|Inc|Corp|LLC|Ltd)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (company.length > 2 && company.length < 50) {
          return company;
        }
      }
    }
    
    return 'Unknown Company';
  };

  const extractPosition = (text: string): string => {
    // Look for position titles in the first few lines
    const lines = text.split('\n').slice(0, 5);
    const firstLine = lines[0]?.trim();
    
    if (firstLine && firstLine.length > 5 && firstLine.length < 100) {
      // Clean up common prefixes
      return firstLine
        .replace(/^(job|position|role|title):\s*/i, '')
        .replace(/^(we are looking for|seeking|hiring)\s*/i, '')
        .trim();
    }
    
    return 'Position Title';
  };

  const extractLocation = (text: string): string => {
    const patterns = [
      /(?:location|based in|office in|work from)\s*:?\s*([^,\n]+)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2,3})/,
      /(remote|hybrid|on-site|onsite)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    return 'Location not specified';
  };

  const extractSalary = (text: string): string => {
    const patterns = [
      /\$[\d,]+(?:k|K)?(?:\s*-\s*\$?[\d,]+(?:k|K)?)?/,
      /(?:salary|pay|compensation|wage)\s*:?\s*\$?[\d,]+(?:k|K)?(?:\s*-\s*\$?[\d,]+(?:k|K)?)?/i,
      /[\d,]+(?:k|K)?(?:\s*-\s*[\d,]+(?:k|K)?)?\s*(?:per year|annually|p\.a\.)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return 'Salary not specified';
  };

  const extractJobType = (text: string): string => {
    const textLower = text.toLowerCase();
    if (textLower.includes('full-time') || textLower.includes('full time')) return 'Full-time';
    if (textLower.includes('part-time') || textLower.includes('part time')) return 'Part-time';
    if (textLower.includes('contract')) return 'Contract';
    if (textLower.includes('internship')) return 'Internship';
    if (textLower.includes('temporary')) return 'Temporary';
    return 'Full-time';
  };

  const extractQualifications = (text: string): string => {
    // Look for requirements/qualifications section
    const patterns = [
      /(?:requirements?|qualifications?|skills?|experience)\s*:?\s*([^.\n]+(?:\.[^.\n]+)*)/i,
      /(?:must have|should have|required)\s*:?\s*([^.\n]+(?:\.[^.\n]+)*)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().substring(0, 200);
      }
    }
    
    return 'See job description for requirements';
  };

  // Extract data using smart parsing
  const extractedData: ParsedJobData = {
    companyName: extractCompany(jobDescription),
    positionTitle: extractPosition(jobDescription),
    jobUrl: 'https://example.com/job',
    applicationDate: new Date().toISOString(),
    status: 'APPLIED',
    notes: 'Smart parsing (no API key needed)',
    salary: extractSalary(jobDescription),
    location: extractLocation(jobDescription),
    jobType: extractJobType(jobDescription),
    jobDescription: jobDescription.substring(0, 500) + (jobDescription.length > 500 ? '...' : ''),
    qualifications: extractQualifications(jobDescription),
    confidence: 0.7 // Lower confidence since it's pattern-based
  };

  return {
    success: true,
    data: extractedData,
    confidence: 0.7
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