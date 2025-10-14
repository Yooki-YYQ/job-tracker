// AI domain types
export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  customPrompt: string;
}

export interface ParsedJobData {
  companyName: string;
  positionTitle: string;
  jobUrl?: string;
  applicationDate?: string;
  status: string;
  notes?: string;
  salary?: string;
  location?: string;
  jobType?: string;
  jobDescription?: string;
  qualifications?: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface AIParseResult {
  success: boolean;
  data?: ParsedJobData;
  confidence?: number;
  error?: string;
}

export interface JobSubmissionForm {
  jobUrl?: string;
  jobDescription: string;
  files: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

// Default AI configuration
export const DEFAULT_AI_CONFIG: AIConfig = {
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.3,
  customPrompt: `# Role and Objective
Extract structured job information from web page content intended for resume submissions.

# Checklist
- Begin with a concise checklist (3–7 bullets) of steps you will follow: 1) parse content, 2) identify target fields, 3) extract information, 4) assemble table, 5) verify accuracy, 6) return output.

# Instructions
- Parse the provided content to identify and extract the fields: position, company, location, pay, job_type, job_description, and qualifications.
- Organize the extracted information into a table with specified columns and formatting.

## Output Format
- Return a Markdown table with the columns, in this order: position | company | location | pay | job_type | job_description | qualifications.
- For multiple positions, include one row per position.
- If a field is not present or cannot be determined, leave the corresponding cell empty.
- Preserve pay field formatting exactly as found in the source content (e.g., "$60,000/year", "30 USD/hour"); do not attempt currency conversion or reformatting.
- Use the exact phrasing for job_type as it appears in the content (e.g., "Full-time", "Part-time", "Contract"); do not standardize or infer alternate representations.
- if the content contains company introduction, put it together into job_description.
- If none of the required fields are found, return a table with the specified columns with all cells left empty.

# Context
- Input: Web page job post content.
- Output: Structured Markdown table summarizing extracted job details.

# Reasoning Steps
- Think through the extraction step by step: parse the content, identify target fields, and copy and paste directly from orginal as the output.
- Only include information explicitly present in the content.

# Planning and Verification
- Decompose the task into parsing, extraction, and table assembly.
- After assembling the table, verify in 1–2 lines that all required columns are present and that only verbatim data from the source content is included.
- Ensure output adheres strictly to the column order and formatting rules.

# Verbosity
- Output should be concise, containing only the data in the required table structure without additional text or commentary.

# Stop Conditions
- Task is complete when all possible fields have been extracted and presented in the table format as specified.

#important
-identify the job_description and qualifications and copy and paste them directly from the original text I gave you without any modifications.`
};
