// =============================================
// Shared TypeScript types across the app
// =============================================
import { Timestamp } from "firebase/firestore";

export interface NewsPost {
  id: string;
  title: string;
  category: "Update" | "Event" | "Dev Diary" | "Careers" | string;
  description: string;
  authorUid: string;
  createdAt: Timestamp | null;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  location: string;
  description: string;
  requirements: string[];
  isOpen: boolean;
  createdAt: Timestamp | null;
}

export interface Application {
  id: string;
  jobId: string | null;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  portfolioUrl: string;
  message: string;
  status: "pending" | "reviewed" | "interviewing" | "hired" | "rejected";
  appliedAt: Timestamp | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  read: boolean;
  status: "new" | "replied" | "archived";
  createdAt: Timestamp | null;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  status: "Released" | "In Development" | "Coming Soon";
  logoPath: string;
  slug: string;
  platforms: string[];
}
