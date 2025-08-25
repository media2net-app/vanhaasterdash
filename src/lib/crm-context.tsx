'use client';

import React, { createContext, useContext, useState } from 'react';
import { 
  Customer, 
  Project, 
  TeamMember, 
  Department, 
  CustomerStatus, 
  ProjectStatus, 
  ProjectType,
  CRMStats 
} from '@/types/crm';

interface CRMContextType {
  customers: Customer[];
  projects: Project[];
  teamMembers: TeamMember[];
  stats: CRMStats;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getProjectsByCustomer: (customerId: string) => Project[];
  getTeamMembersByDepartment: (department: Department) => TeamMember[];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

// Demo data
const demoTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jan van der Berg',
    email: 'jan@vanhaaster.nl',
    department: Department.BUITENDIENST,
    role: 'Account Manager',
    phone: '0528 348450'
  },
  {
    id: '2',
    name: 'Lisa de Vries',
    email: 'lisa@vanhaaster.nl',
    department: Department.STUDIO,
    role: 'Creative Designer',
    phone: '0528 348450'
  },
  {
    id: '3',
    name: 'Mark Jansen',
    email: 'mark@vanhaaster.nl',
    department: Department.ADMINISTRATIE_PLANNING,
    role: 'Project Manager',
    phone: '0528 348450'
  }
];

const demoCustomers: Customer[] = [
  {
    id: '1',
    name: 'Keukenhof Keukens',
    company: 'Keukenhof Keukens',
    email: 'info@keukenhofkeukens.nl',
    phone: '0528 123456',
    address: 'Hoofdstraat 123',
    city: 'Hoogeveen',
    postalCode: '7901 AA',
    website: 'www.keukenhofkeukens.nl',
    industry: 'Keukenbedrijf',
    status: CustomerStatus.ACTIVE,
    assignedTo: demoTeamMembers[0],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    notes: 'Klant voor complete metamorfose - logo, website, visitekaartjes, offertemap, baniervlaggen en pand uitstraling.',
    projects: []
  },
  {
    id: '2',
    name: 'Wildlands Adventure Zoo',
    company: 'Wildlands Adventure Zoo Emmen',
    email: 'info@wildlands.nl',
    phone: '0591 850850',
    address: 'Raadhuisplein 99',
    city: 'Emmen',
    postalCode: '7811 AP',
    website: 'www.wildlands.nl',
    industry: 'Attractiepark',
    status: CustomerStatus.ACTIVE,
    assignedTo: demoTeamMembers[1],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    notes: 'Samenwerking sinds 2016. Honderden borden vormgegeven en geleverd. Kennis van WILDLANDS-stijl.',
    projects: []
  }
];

const demoProjects: Project[] = [
  {
    id: '1',
    customerId: '1',
    name: 'Complete Metamorfose Keukenhof',
    description: 'Vernieuwen logo, website, visitekaartjes, offertemap, baniervlaggen en pand uitstraling',
    type: ProjectType.BRANDING,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    budget: 15000,
    assignedTo: demoTeamMembers[0],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    customerId: '2',
    name: 'Educatieve Bebording',
    description: 'Gethematiseerde signing voor het park',
    type: ProjectType.SIGNAGE,
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date('2024-02-01'),
    budget: 25000,
    assignedTo: demoTeamMembers[1],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  }
];

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [teamMembers] = useState<TeamMember[]>(demoTeamMembers);

  // Calculate stats
  const stats: CRMStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === CustomerStatus.ACTIVE).length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS || p.status === ProjectStatus.PLANNING).length,
    revenue: projects.reduce((sum, p) => sum + p.budget, 0),
    projectsByType: Object.values(ProjectType).reduce((acc, type) => {
      acc[type] = projects.filter(p => p.type === type).length;
      return acc;
    }, {} as Record<ProjectType, number>),
    customersByStatus: Object.values(CustomerStatus).reduce((acc, status) => {
      acc[status] = customers.filter(c => c.status === status).length;
      return acc;
    }, {} as Record<CustomerStatus, number>)
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, ...updates, updatedAt: new Date() }
        : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    setProjects(prev => prev.filter(project => project.customerId !== id));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  const getProjectsByCustomer = (customerId: string) => {
    return projects.filter(project => project.customerId === customerId);
  };

  const getTeamMembersByDepartment = (department: Department) => {
    return teamMembers.filter(member => member.department === department);
  };

  const value: CRMContextType = {
    customers,
    projects,
    teamMembers,
    stats,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProject,
    updateProject,
    deleteProject,
    getCustomerById,
    getProjectsByCustomer,
    getTeamMembersByDepartment
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};
