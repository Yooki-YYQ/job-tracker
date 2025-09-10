import axios from "axios";
// Backend address
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" }
});

// ---- types (consistent with the backend Prisma）----
export const APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "OFFER_RECEIVED",
  "REJECTED",
  "WITHDRAWN",
  "ACCEPTED",
] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export interface Application {
  id: string;
  companyName: string;
  positionTitle: string;
  jobUrl?: string | null;
  applicationDate?: string | null; // ISO string
  status: ApplicationStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}



