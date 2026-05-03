
export interface Announcement {
  id: number;
  tenantId: number;
  title: string;
  content: string;
  createdByName: string;
  expiresAt: string | null;       // ISO date
  read: boolean;
  createdAt: string;              // ISO datetime
  updatedAt: string;              // ISO datetime
}

export interface AnnouncementPage {
  content: Announcement[];
  last: boolean;
  number: number;
}

export interface AnnouncementUser {
  id: number;
  tenantId: number;
  title: string;
  content: string;
  createdByName: string;
  expiresAt: string | null;   
  read: boolean;
  createdAt: string;          
  updatedAt: string;
}

export interface AnnouncementUserPage {
  content: AnnouncementUser[];
  last: boolean;
  number: number;
}