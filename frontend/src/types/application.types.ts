// Application domain types
export interface Application {
  id: string;
  data: Record<string, any>; // Dynamic fields stored in JSONB
  createdAt: string;
  updatedAt: string;
  files?: ApplicationFile[];
  _count?: { files: number };
}

export type ApplicationStatus = 
  | 'APPLIED' 
  | 'INTERVIEW_SCHEDULED' 
  | 'INTERVIEWED' 
  | 'OFFER_RECEIVED' 
  | 'REJECTED' 
  | 'WITHDRAWN' 
  | 'ACCEPTED';

export interface ApplicationFile {
  id: string;
  applicationId: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

// DTOs for API operations
export interface CreateApplicationDTO {
  data: Record<string, any>; // All user data goes here
}

export interface UpdateApplicationDTO {
  data?: Record<string, any>; // Partial update of user data
}
