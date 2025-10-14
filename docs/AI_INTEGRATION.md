# AI Integration Guide

This document provides comprehensive guidance for integrating AI services into the Job Application Tracker for automatic job description parsing.

## 🎯 Overview

AI integration provides:
- **Automatic Parsing**: Extract structured data from job descriptions
- **Multiple AI Providers**: Support for OpenAI, Claude, Gemini, and others
- **Custom Prompts**: User-defined parsing prompts for better accuracy
- **Fallback Support**: Mock parsing when AI services are unavailable
- **Confidence Scoring**: AI confidence levels for parsed data

## 🤖 Supported AI Providers

### Primary Providers
- **OpenAI GPT-4**: High accuracy, recommended for best results
- **OpenAI GPT-3.5**: Cost-effective alternative
- **Anthropic Claude**: Excellent for complex parsing tasks
- **Google Gemini**: Good performance, competitive pricing

### Fallback Options
- **Mock Parser**: Regex-based parsing for offline use
- **Local AI**: Future support for local models

## 🔧 Setup Requirements

### OpenAI Setup
```bash
# Get API key from https://platform.openai.com/api-keys
# Add to environment variables
export OPENAI_API_KEY="sk-your-api-key-here"
```

### Claude Setup
```bash
# Get API key from https://console.anthropic.com/
# Add to environment variables
export ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
```

### Gemini Setup
```bash
# Get API key from https://makersuite.google.com/app/apikey
# Add to environment variables
export GOOGLE_API_KEY="your-api-key-here"
```

## 🚀 Implementation

### AI Service Interface

```typescript
interface AIService {
  // Configuration
  setApiKey(key: string): void;
  setModel(model: string): void;
  setPrompt(prompt: string): void;
  
  // Parsing
  parseJobDescription(description: string, url?: string): Promise<ParsedJobData>;
  validateParsedData(data: ParsedJobData): boolean;
  
  // Fallback
  mockParse(description: string): Promise<ParsedJobData>;
}

interface ParsedJobData {
  company: string;
  position: string;
  location?: string;
  pay?: string;
  job_type?: string;
  job_description?: string;
  qualifications?: string;
  requirements?: string[];
  confidence: number;
}
```

### OpenAI Integration

```typescript
class OpenAIService implements AIService {
  private apiKey: string;
  private model: string = 'gpt-4';
  private prompt: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.prompt = this.getDefaultPrompt();
  }
  
  setApiKey(key: string): void {
    this.apiKey = key;
  }
  
  setModel(model: string): void {
    this.model = model;
  }
  
  setPrompt(prompt: string): void {
    this.prompt = prompt;
  }
  
  async parseJobDescription(description: string, url?: string): Promise<ParsedJobData> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.prompt
            },
            {
              role: 'user',
              content: `Job Description:\n${description}\n\nJob URL: ${url || 'Not provided'}`
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return this.parseResponse(content);
    } catch (error) {
      console.error('OpenAI parsing failed:', error);
      throw error;
    }
  }
  
  private parseResponse(content: string): ParsedJobData {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Fallback to regex parsing
      return this.regexParse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.regexParse(content);
    }
  }
  
  private regexParse(content: string): ParsedJobData {
    const company = this.extractField(content, 'company', 'Company');
    const position = this.extractField(content, 'position', 'Position');
    const location = this.extractField(content, 'location', 'Location');
    const pay = this.extractField(content, 'pay', 'Pay|Salary');
    const jobType = this.extractField(content, 'job_type', 'Job Type|Employment Type');
    
    return {
      company: company || 'Unknown',
      position: position || 'Unknown',
      location,
      pay,
      job_type: jobType,
      job_description: content,
      qualifications: this.extractQualifications(content),
      requirements: this.extractRequirements(content),
      confidence: 0.7 // Default confidence for regex parsing
    };
  }
  
  private extractField(content: string, field: string, patterns: string): string | undefined {
    const regex = new RegExp(`(?:${patterns}):\\s*([^\n]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : undefined;
  }
  
  private extractQualifications(content: string): string {
    const qualificationPatterns = [
      /qualifications?:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      /requirements?:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
      /skills?:?\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i
    ];
    
    for (const pattern of qualificationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return '';
  }
  
  private extractRequirements(content: string): string[] {
    const requirements: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[-•*]\s+/)) {
        requirements.push(line.replace(/^[-•*]\s+/, '').trim());
      }
    }
    
    return requirements;
  }
  
  private getDefaultPrompt(): string {
    return `# Role and Objective
Extract structured job information from web page content intended for resume submissions.

# Checklist
Begin with a concise checklist (3–7 bullets) of steps you will follow:
1) parse content, 2) identify target fields, 3) extract information, 4) assemble table, 5) verify accuracy, 6) return output.

# Instructions
Parse the provided content to identify and extract the fields: position, company, location, pay, job_type, job_description, and qualifications.
Organize the extracted information into a table with specified columns and formatting.

## Output Format
Return a JSON object with the following structure:
{
  "company": "Company Name",
  "position": "Job Title",
  "location": "Location",
  "pay": "Salary Information",
  "job_type": "Full-time/Part-time/Contract",
  "job_description": "Full job description",
  "qualifications": "Required qualifications",
  "requirements": ["Requirement 1", "Requirement 2"],
  "confidence": 0.95
}

For multiple positions, include one row per position.
If a field is not present or cannot be determined, use null for that field.
Preserve pay field formatting exactly as found in the source content (e.g., "$60,000/year", "30 USD/hour"); do not attempt currency conversion or reformatting.
Use the exact phrasing for job_type as it appears in the content (e.g., "Full-time", "Part-time", "Contract"); do not standardize or infer alternate representations.
If the content contains company introduction, put it together into job_description.
If none of the required fields are found, return a JSON object with the specified fields with null values.

# Context
Input: Web page job post content.
Output: Structured JSON object summarizing extracted job details.

# Reasoning Steps
Think through the extraction step by step: parse the content, identify target fields, and copy and paste directly from original as the output.
Only include information explicitly present in the content.

# Planning and Verification
Decompose the task into parsing, extraction, and JSON assembly.
After assembling the JSON, verify in 1–2 lines that all required fields are present and that only verbatim data from the source content is included.
Ensure output adheres strictly to the JSON structure and formatting rules.

# Verbosity
Output should be concise, containing only the JSON data without additional text or commentary.

# Stop Conditions
Task is complete when all possible fields have been extracted and presented in the JSON format as specified.

# Important
Identify the job_description and qualifications and copy and paste them directly from the original text without any modifications.`;
  }
  
  validateParsedData(data: ParsedJobData): boolean {
    return !!(data.company && data.position && data.confidence > 0);
  }
  
  async mockParse(description: string): Promise<ParsedJobData> {
    // Fallback mock parsing
    return {
      company: 'Mock Company',
      position: 'Mock Position',
      location: 'Mock Location',
      pay: 'Mock Salary',
      job_type: 'Full-time',
      job_description: description,
      qualifications: 'Mock qualifications',
      requirements: ['Mock requirement 1', 'Mock requirement 2'],
      confidence: 0.5
    };
  }
}
```

### Claude Integration

```typescript
class ClaudeService implements AIService {
  private apiKey: string;
  private model: string = 'claude-3-sonnet-20240229';
  private prompt: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.prompt = this.getDefaultPrompt();
  }
  
  setApiKey(key: string): void {
    this.apiKey = key;
  }
  
  setModel(model: string): void {
    this.model = model;
  }
  
  setPrompt(prompt: string): void {
    this.prompt = prompt;
  }
  
  async parseJobDescription(description: string, url?: string): Promise<ParsedJobData> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${this.prompt}\n\nJob Description:\n${description}\n\nJob URL: ${url || 'Not provided'}`
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.content[0].text;
      
      return this.parseResponse(content);
    } catch (error) {
      console.error('Claude parsing failed:', error);
      throw error;
    }
  }
  
  private parseResponse(content: string): ParsedJobData {
    // Similar to OpenAI implementation
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      return this.regexParse(content);
    } catch (error) {
      return this.regexParse(content);
    }
  }
  
  // ... (similar regex parsing methods as OpenAI)
  
  validateParsedData(data: ParsedJobData): boolean {
    return !!(data.company && data.position && data.confidence > 0);
  }
  
  async mockParse(description: string): Promise<ParsedJobData> {
    return {
      company: 'Mock Company',
      position: 'Mock Position',
      location: 'Mock Location',
      pay: 'Mock Salary',
      job_type: 'Full-time',
      job_description: description,
      qualifications: 'Mock qualifications',
      requirements: ['Mock requirement 1', 'Mock requirement 2'],
      confidence: 0.5
    };
  }
}
```

### AI Service Factory

```typescript
class AIServiceFactory {
  static createService(provider: string, apiKey: string): AIService {
    switch (provider.toLowerCase()) {
      case 'openai':
        return new OpenAIService(apiKey);
      case 'claude':
        return new ClaudeService(apiKey);
      case 'gemini':
        return new GeminiService(apiKey);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
  
  static getSupportedProviders(): string[] {
    return ['openai', 'claude', 'gemini'];
  }
  
  static getDefaultProvider(): string {
    return 'openai';
  }
}
```

## 🎛️ Configuration Management

### AI Configuration Service

```typescript
class AIConfigService {
  private static readonly STORAGE_KEY = 'ai_config';
  
  static load(): AIConfig {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return this.getDefaultConfig();
  }
  
  static save(config: AIConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }
  
  static reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  private static getDefaultConfig(): AIConfig {
    return {
      enabled: false,
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4',
      prompt: this.getDefaultPrompt(),
      customPrompt: '',
      useCustomPrompt: false
    };
  }
  
  private static getDefaultPrompt(): string {
    return `# Role and Objective
Extract structured job information from web page content intended for resume submissions.

# Checklist
Begin with a concise checklist (3–7 bullets) of steps you will follow:
1) parse content, 2) identify target fields, 3) extract information, 4) assemble table, 5) verify accuracy, 6) return output.

# Instructions
Parse the provided content to identify and extract the fields: position, company, location, pay, job_type, job_description, and qualifications.
Organize the extracted information into a table with specified columns and formatting.

## Output Format
Return a JSON object with the following structure:
{
  "company": "Company Name",
  "position": "Job Title",
  "location": "Location",
  "pay": "Salary Information",
  "job_type": "Full-time/Part-time/Contract",
  "job_description": "Full job description",
  "qualifications": "Required qualifications",
  "requirements": ["Requirement 1", "Requirement 2"],
  "confidence": 0.95
}

For multiple positions, include one row per position.
If a field is not present or cannot be determined, use null for that field.
Preserve pay field formatting exactly as found in the source content (e.g., "$60,000/year", "30 USD/hour"); do not attempt currency conversion or reformatting.
Use the exact phrasing for job_type as it appears in the content (e.g., "Full-time", "Part-time", "Contract"); do not standardize or infer alternate representations.
If the content contains company introduction, put it together into job_description.
If none of the required fields are found, return a JSON object with the specified fields with null values.

# Context
Input: Web page job post content.
Output: Structured JSON object summarizing extracted job details.

# Reasoning Steps
Think through the extraction step by step: parse the content, identify target fields, and copy and paste directly from original as the output.
Only include information explicitly present in the content.

# Planning and Verification
Decompose the task into parsing, extraction, and JSON assembly.
After assembling the JSON, verify in 1–2 lines that all required fields are present and that only verbatim data from the source content is included.
Ensure output adheres strictly to the JSON structure and formatting rules.

# Verbosity
Output should be concise, containing only the JSON data without additional text or commentary.

# Stop Conditions
Task is complete when all possible fields have been extracted and presented in the JSON format as specified.

# Important
Identify the job_description and qualifications and copy and paste them directly from the original text without any modifications.`;
  }
}

interface AIConfig {
  enabled: boolean;
  provider: string;
  apiKey: string;
  model: string;
  prompt: string;
  customPrompt: string;
  useCustomPrompt: boolean;
}
```

## 🧪 Testing and Validation

### AI Response Validation

```typescript
class AIResponseValidator {
  static validateParsedData(data: ParsedJobData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required fields
    if (!data.company || data.company.trim() === '') {
      errors.push('Company name is required');
    }
    
    if (!data.position || data.position.trim() === '') {
      errors.push('Position title is required');
    }
    
    // Confidence validation
    if (data.confidence < 0 || data.confidence > 1) {
      errors.push('Confidence must be between 0 and 1');
    }
    
    // Optional field validation
    if (data.pay && !this.isValidSalaryFormat(data.pay)) {
      warnings.push('Salary format may be invalid');
    }
    
    if (data.location && data.location.length > 100) {
      warnings.push('Location field is unusually long');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence: data.confidence
    };
  }
  
  private static isValidSalaryFormat(salary: string): boolean {
    // Basic salary format validation
    const salaryPatterns = [
      /\$\d{1,3}(,\d{3})*(\.\d{2})?/g, // $50,000.00
      /\d{1,3}(,\d{3})*(\.\d{2})?\s*(USD|dollars?)/gi, // 50,000 USD
      /\d+\s*(per|/)\s*(hour|hr|year|yr|month|mo)/gi, // 25 per hour
      /competitive|negotiable|TBD|TBA/gi // Competitive salary
    ];
    
    return salaryPatterns.some(pattern => pattern.test(salary));
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number;
}
```

## 🔄 Error Handling

### AI Service Error Handling

```typescript
class AIErrorHandler {
  static async handleError(error: any, fallbackService: AIService): Promise<ParsedJobData> {
    console.error('AI service error:', error);
    
    if (error.code === 'insufficient_quota') {
      throw new Error('AI service quota exceeded. Please check your API limits.');
    }
    
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid API key. Please check your AI service configuration.');
    }
    
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('Rate limit exceeded. Please wait before trying again.');
    }
    
    // Fallback to mock parsing
    console.log('Falling back to mock parsing');
    return fallbackService.mockParse('');
  }
}
```

## 📊 Performance Monitoring

### AI Performance Metrics

```typescript
class AIPerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  
  static recordParsingTime(provider: string, time: number): void {
    if (!this.metrics.has(provider)) {
      this.metrics.set(provider, []);
    }
    
    this.metrics.get(provider)!.push(time);
  }
  
  static getAverageParsingTime(provider: string): number {
    const times = this.metrics.get(provider) || [];
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  static getSuccessRate(provider: string): number {
    const times = this.metrics.get(provider) || [];
    if (times.length === 0) return 0;
    
    const successful = times.filter(time => time > 0).length;
    return successful / times.length;
  }
  
  static getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [provider, times] of this.metrics.entries()) {
      result[provider] = {
        averageTime: this.getAverageParsingTime(provider),
        successRate: this.getSuccessRate(provider),
        totalRequests: times.length
      };
    }
    
    return result;
  }
}
```

---

**Last Updated**: September 2024
**Version**: 1.0.0

