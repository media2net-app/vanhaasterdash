export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  website?: string;
  industry: string;
  status: CustomerStatus;
  assignedTo: TeamMember;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  projects: Project[];
}

export interface Project {
  id: string;
  customerId: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget: number;
  assignedTo: TeamMember;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: string;
  phone?: string;
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
  LEAD = 'lead'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold'
}

export enum ProjectType {
  OFFLINE = 'offline',
  ONLINE = 'online',
  STRATEGY = 'strategy',
  BRANDING = 'branding',
  WEBSITE = 'website',
  SOCIAL_MEDIA = 'social_media',
  PRINT = 'print',
  SIGNAGE = 'signage'
}

export enum Department {
  BUITENDIENST = 'buitendienst',
  STUDIO = 'studio',
  ADMINISTRATIE_PLANNING = 'administratie_planning'
}

export interface CRMStats {
  totalCustomers: number;
  activeCustomers: number;
  totalProjects: number;
  activeProjects: number;
  revenue: number;
  projectsByType: Record<ProjectType, number>;
  customersByStatus: Record<CustomerStatus, number>;
}
