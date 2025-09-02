'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCRM } from '@/lib/crm-context';
import { CustomerStatus, ProjectStatus, ProjectType, Department } from '@/types/crm';
import { OpenStreetMapRoute } from './OpenStreetMapRoute';
import { PlanningTimeline } from './PlanningTimeline';

export const CRMDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { customers, projects, addCustomer, updateCustomer, deleteCustomer } = useCRM();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === CustomerStatus.ACTIVE).length,
    totalProjects: projects.length,
    revenue: 125000
  };

  const teamMembers = [
    { id: 1, name: 'Ron Stoel', role: 'Creative Director', email: 'ron@vanhaaster.nl', phone: '+31 6 12345678', department: Department.STUDIO },
    { id: 2, name: 'Lisa de Vries', role: 'Senior Designer', email: 'lisa@vanhaaster.nl', phone: '+31 6 12345679', department: Department.STUDIO },
    { id: 3, name: 'Mark Jansen', role: 'Account Manager', email: 'mark@vanhaaster.nl', phone: '+31 6 12345680', department: Department.BUITENDIENST },
    { id: 4, name: 'Sarah Bakker', role: 'Project Coordinator', email: 'sarah@vanhaaster.nl', phone: '+31 6 12345681', department: Department.ADMINISTRATIE_PLANNING }
  ];

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE: return 'bg-green-500 text-white';
      case CustomerStatus.INACTIVE: return 'bg-gray-500 text-white';
      case CustomerStatus.PROSPECT: return 'bg-blue-500 text-white';
      case CustomerStatus.LEAD: return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDepartmentColor = (department: Department) => {
    switch (department) {
      case Department.STUDIO: return 'bg-[#E2017A] text-white';
      case Department.BUITENDIENST: return 'bg-blue-500 text-white';
      case Department.ADMINISTRATIE_PLANNING: return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="min-h-screen bg-[#111111] flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-black/40 shadow-lg transition-all duration-300 ease-in-out border-r border-[#E2017A]/20`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-[#E2017A]/20">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#E2017A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                {sidebarOpen && (
                  <span className="ml-3 text-white font-semibold text-lg">Vanhaaster</span>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-[#E2017A] hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {[
                { id: 'overview', label: 'Overzicht', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                { id: 'customers', label: 'Klanten', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                { id: 'projects', label: 'Projecten', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                { id: 'planning', label: 'Planning', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { id: 'routes', label: 'Routes', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10V4m0 0L9 7' },
                { id: 'pipeline', label: 'Pipeline', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                { id: 'team', label: 'Team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { id: 'invoicing', label: 'Facturering', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#E2017A] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-black/60'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {sidebarOpen && item.label}
                </button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-[#E2017A]/20">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-[#E2017A]">{user.email}</p>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="text-[#E2017A] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-[#111111] border-b border-[#E2017A]/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">
                  {activeTab === 'overview' && 'Dashboard Overzicht'}
                  {activeTab === 'customers' && 'Klantenbeheer'}
                  {activeTab === 'projects' && 'Projecten'}
                  {activeTab === 'planning' && 'Planning'}
                  {activeTab === 'routes' && 'Route Overzicht'}
                  {activeTab === 'pipeline' && 'Sales Pipeline'}
                  {activeTab === 'team' && 'Team Overzicht'}
                  {activeTab === 'invoicing' && 'Facturering'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-[#E2017A]">
                  Welkom, <span className="font-semibold text-white">{user?.name}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-[#E2017A] truncate">Totaal Klanten</dt>
                              <dd className="text-lg font-medium text-white">{stats.totalCustomers}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                                      <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-[#E2017A] truncate">Actieve Klanten</dt>
                            <dd className="text-lg font-medium text-white">{stats.activeCustomers}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                                      <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-[#E2017A] truncate">Totaal Projecten</dt>
                            <dd className="text-lg font-medium text-white">{stats.totalProjects}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                                      <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-[#E2017A] truncate">Omzet</dt>
                            <dd className="text-lg font-medium text-white">€{stats.revenue.toLocaleString('nl-NL')}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Recent Customers */}
                  <div className="bg-black/40 shadow-lg rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-white mb-4">
                        Recente klanten
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E2017A]/20">
                          <thead className="bg-[#E2017A]/5">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#E2017A] uppercase tracking-wider">
                                Naam
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#E2017A] uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#E2017A] uppercase tracking-wider">
                                Projecten
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#E2017A] uppercase tracking-wider">
                                Laatste contact
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-transparent divide-y divide-[#E2017A]/10">
                            {customers.slice(0, 5).map((customer) => (
                              <tr key={customer.id} className="hover:bg-[#E2017A]/5">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                                      <span className="text-white font-semibold text-sm">
                                        {customer.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-white">{customer.name}</div>
                                      <div className="text-sm text-[#E2017A]/70">{customer.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                    {customer.status === CustomerStatus.ACTIVE ? 'Actief' :
                                     customer.status === CustomerStatus.INACTIVE ? 'Inactief' :
                                     customer.status === CustomerStatus.PROSPECT ? 'Prospect' : 'Lead'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  {projects.filter(p => p.customerId === customer.id).length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2017A]/70">
                                  {new Date().toLocaleDateString('nl-NL')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Planning Tab */}
              {activeTab === 'planning' && (
                <div className="space-y-6">
                  {/* Planning Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                         <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                       <div className="p-5">
                         <div className="flex items-center">
                           <div className="flex-shrink-0">
                             <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                               </svg>
                             </div>
                           </div>
                           <div className="ml-5 w-0 flex-1">
                             <dl>
                               <dt className="text-sm font-medium text-[#E2017A] truncate">Geplande projecten</dt>
                               <dd className="text-lg font-medium text-white">{projects.filter(p => p.status === ProjectStatus.PLANNING).length}</dd>
                             </dl>
                           </div>
                         </div>
                       </div>
                     </div>

                                          <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-[#E2017A] truncate">Lopende projecten</dt>
                                <dd className="text-lg font-medium text-white">{projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length}</dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                                          <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-[#E2017A] truncate">Deadlines deze week</dt>
                                <dd className="text-lg font-medium text-white">3</dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                                          <div className="bg-black/40 overflow-hidden shadow-lg rounded-lg border border-gray-700">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-[#E2017A] rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-[#E2017A] truncate">Team meetings</dt>
                                <dd className="text-lg font-medium text-white">4</dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Planning Timeline */}
                  <PlanningTimeline />

                  {/* Quick Actions */}
                  <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Snelle Acties</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Nieuw Project</span>
                      </button>
                      <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Team Meeting</span>
                      </button>
                      <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span>Klantgesprek</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Routes Tab */}
              {activeTab === 'routes' && (
                <div className="space-y-6">
                  <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Route Overzicht</h3>
                    <OpenStreetMapRoute className="h-96" />
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  {/* Klanten Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Klantenbeheer</h1>
                      <p className="text-gray-400">Beheer al je klanten en hun projecten</p>
                    </div>
                    <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      + Nieuwe Klant
                    </button>
                  </div>

                  {/* Klanten Statistieken */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                          <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Totaal Klanten</p>
                          <p className="text-2xl font-bold text-white">247</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Actieve Klanten</p>
                          <p className="text-2xl font-bold text-white">189</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">In Afwachting</p>
                          <p className="text-2xl font-bold text-white">34</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Gemiddelde Waarde</p>
                          <p className="text-2xl font-bold text-white">€2.847</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Klanten Tabel */}
                  <div className="bg-black/40 rounded-lg border border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Alle Klanten</h3>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Zoek klanten..."
                            className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm w-64"
                          />
                          <select className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm">
                            <option>Alle Statussen</option>
                            <option>Actief</option>
                            <option>In Afwachting</option>
                            <option>Inactief</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/20">
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Klant</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Contact</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Status</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Projecten</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Laatste Activiteit</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Acties</th>
                          </tr>
                        </thead>
                        <tbody className="text-white">
                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#E2017A] rounded-full flex items-center justify-center text-white font-bold">
                                  V
                                </div>
                                <div>
                                  <div className="font-medium">Vanhaaster Reclamebureau</div>
                                  <div className="text-sm text-gray-400">Hoogeveen, Nederland</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Ron Stoel</div>
                                <div className="text-sm text-gray-400">ron@vanhaaster.nl</div>
                                <div className="text-sm text-gray-400">+31 528 123 456</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">12 projecten</div>
                                <div className="text-gray-400">€45.230 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              2 dagen geleden
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  W
                                </div>
                                <div>
                                  <div className="font-medium">Wildlands Adventure Zoo</div>
                                  <div className="text-sm text-gray-400">Emmen, Nederland</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Sarah Johnson</div>
                                <div className="text-sm text-gray-400">sarah@wildlands.nl</div>
                                <div className="text-sm text-gray-400">+31 591 654 321</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">8 projecten</div>
                                <div className="text-gray-400">€28.450 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              1 week geleden
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                  A
                                </div>
                                <div>
                                  <div className="font-medium">Assen Centrum</div>
                                  <div className="text-sm text-gray-400">Assen, Nederland</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Mark de Vries</div>
                                <div className="text-sm text-gray-400">mark@assencentrum.nl</div>
                                <div className="text-sm text-gray-400">+31 592 123 789</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                In Afwachting
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">3 projecten</div>
                                <div className="text-gray-400">€12.800 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              3 dagen geleden
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  G
                                </div>
                                <div>
                                  <div className="font-medium">Groningen Educatie</div>
                                  <div className="text-sm text-gray-400">Groningen, Nederland</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Lisa Bakker</div>
                                <div className="text-sm text-gray-400">lisa@groningeneducatie.nl</div>
                                <div className="text-sm text-gray-400">+31 50 987 654</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                Nieuw
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">1 project</div>
                                <div className="text-gray-400">€5.200 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                               Vandaag
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Paginering */}
                    <div className="px-6 py-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Toon 1-10 van 247 klanten
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50">
                            Vorige
                          </button>
                          <button className="px-3 py-2 text-sm bg-[#E2017A] text-white rounded-md">1</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">2</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">3</button>
                          <span className="px-3 py-2 text-sm text-gray-400">...</span>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">25</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">
                            Volgende
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Projects Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Projecten</h1>
                      <p className="text-gray-400">Beheer al je projecten en hun status</p>
                    </div>
                    <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      + Nieuw Project
                    </button>
                  </div>

                  {/* Projects Statistieken */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                          <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Totaal Projecten</p>
                          <p className="text-2xl font-bold text-white">247</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Actieve Projecten</p>
                          <p className="text-2xl font-bold text-white">189</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">In Afwachting</p>
                          <p className="text-2xl font-bold text-white">34</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Gemiddelde Waarde</p>
                          <p className="text-2xl font-bold text-white">€2.847</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Tabel */}
                  <div className="bg-black/40 rounded-lg border border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Alle Projecten</h3>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Zoek projecten..."
                            className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm w-64"
                          />
                          <select className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm">
                            <option>Alle Statussen</option>
                            <option>Actief</option>
                            <option>In Afwachting</option>
                            <option>Inactief</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/20">
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Project</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Klant</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Status</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Budget</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Deadline</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Acties</th>
                          </tr>
                        </thead>
                        <tbody className="text-white">
                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#E2017A] rounded-full flex items-center justify-center text-white font-bold">
                                  P
                                </div>
                                <div>
                                  <div className="font-medium">Website Ontwerp</div>
                                  <div className="text-sm text-gray-400">Vanhaaster Reclamebureau</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Vanhaaster Reclamebureau</div>
                                <div className="text-sm text-gray-400">Hoogeveen, Nederland</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">€15.000</div>
                                <div className="text-gray-400">€15.000 uitgegeven</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              2023-12-31
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  A
                                </div>
                                <div>
                                  <div className="font-medium">Advertentie Campagne</div>
                                  <div className="text-sm text-gray-400">Wildlands Adventure Zoo</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Wildlands Adventure Zoo</div>
                                <div className="text-sm text-gray-400">Emmen, Nederland</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                In Afwachting
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">€5.000</div>
                                <div className="text-gray-400">€0 uitgegeven</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              2024-01-15
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  S
                                </div>
                                <div>
                                  <div className="font-medium">Social Media Strategie</div>
                                  <div className="text-sm text-gray-400">Assen Centrum</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Assen Centrum</div>
                                <div className="text-sm text-gray-400">Assen, Nederland</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                Nieuw
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">€10.000</div>
                                <div className="text-gray-400">€0 uitgegeven</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              2024-02-01
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                  C
                                </div>
                                <div>
                                  <div className="font-medium">Content Creatie</div>
                                  <div className="text-sm text-gray-400">Groningen Educatie</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium">Groningen Educatie</div>
                                <div className="text-sm text-gray-400">Groningen, Nederland</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                                Inactief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">€2.000</div>
                                <div className="text-gray-400">€2.000 uitgegeven</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400">
                              2023-12-20
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Paginering */}
                    <div className="px-6 py-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Toon 1-10 van 247 projecten
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50">
                            Vorige
                          </button>
                          <button className="px-3 py-2 text-sm bg-[#E2017A] text-white rounded-md">1</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">2</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">3</button>
                          <span className="px-3 py-2 text-sm text-gray-400">...</span>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">25</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">
                            Volgende
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pipeline Tab */}
              {activeTab === 'pipeline' && (
                <div className="space-y-6">
                  {/* Pipeline Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
                      <p className="text-gray-400">Beheer je sales leads en deals in Kanban stijl</p>
                    </div>
                    <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      + Nieuwe Lead
                    </button>
                  </div>

                  {/* Pipeline Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Totaal Leads</p>
                          <p className="text-2xl font-bold text-white">156</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Won Deals</p>
                          <p className="text-2xl font-bold text-white">€89.450</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Pipeline Waarde</p>
                          <p className="text-2xl font-bold text-white">€234.800</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                          <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Conversie Rate</p>
                          <p className="text-2xl font-bold text-white">23.4%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban Board */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* New Leads */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Nieuwe Leads</h3>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">12</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Groningen Marketing</h4>
                            <span className="text-xs text-gray-400">€8.500</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Website redesign voor lokale marketing bureau</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                              <span className="text-xs text-gray-400">Gerard</span>
                            </div>
                            <span className="text-xs text-gray-400">2d geleden</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Drenthe Events</h4>
                            <span className="text-xs text-gray-400">€12.000</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Event branding en promotie materiaal</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">D</div>
                              <span className="text-xs text-gray-400">Diana</span>
                            </div>
                            <span className="text-xs text-gray-400">1d geleden</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Friesland Retail</h4>
                            <span className="text-xs text-gray-400">€6.800</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Winkel interieur en signage</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">F</div>
                              <span className="text-xs text-gray-400">Frank</span>
                            </div>
                            <span className="text-xs text-gray-400">3d geleden</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Qualified */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Gekwalificeerd</h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">8</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Overijssel Tech</h4>
                            <span className="text-xs text-gray-400">€15.000</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Tech startup branding en website</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-[#E2017A] rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>
                              <span className="text-xs text-gray-400">Olivia</span>
                            </div>
                            <span className="text-xs text-gray-400">1w geleden</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Gelderland Food</h4>
                            <span className="text-xs text-gray-400">€9.200</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Restaurant menu en branding</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                              <span className="text-xs text-gray-400">Gijs</span>
                            </div>
                            <span className="text-xs text-gray-400">5d geleden</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proposal */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Proposal</h3>
                        <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">6</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Utrecht Education</h4>
                            <span className="text-xs text-gray-400">€18.500</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Educatieve content en materialen</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
                              <span className="text-xs text-gray-400">Ursula</span>
                            </div>
                            <span className="text-xs text-gray-400">2d geleden</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Noord-Holland Media</h4>
                            <span className="text-xs text-gray-400">€22.000</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Media campagne en advertenties</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>
                              <span className="text-xs text-gray-400">Nina</span>
                            </div>
                            <span className="text-xs text-gray-400">1d geleden</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Negotiation */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Onderhandeling</h3>
                        <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">4</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Zuid-Holland Retail</h4>
                            <span className="text-xs text-gray-400">€28.000</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Winkelketen rebranding</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>
                              <span className="text-xs text-gray-400">Zara</span>
                            </div>
                            <span className="text-xs text-gray-400">Vandaag</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Limburg Tourism</h4>
                            <span className="text-xs text-gray-400">€16.500</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Toerisme promotie campagne</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">L</div>
                              <span className="text-xs text-gray-400">Lucas</span>
                            </div>
                            <span className="text-xs text-gray-400">1d geleden</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Won */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Gewonnen</h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">5</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Flevoland Sports</h4>
                            <span className="text-xs text-gray-400">€14.200</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Sportclub branding en materialen</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">F</div>
                              <span className="text-xs text-gray-400">Femke</span>
                            </div>
                            <span className="text-xs text-gray-400">1w geleden</span>
                          </div>
                        </div>

                        <div className="bg-[#111111] rounded-lg border border-gray-700 p-3 cursor-pointer hover:border-[#E2017A]/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">Zeeland Maritime</h4>
                            <span className="text-xs text-gray-400">€19.800</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Maritieme sector branding</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>
                              <span className="text-xs text-gray-400">Zeno</span>
                            </div>
                            <span className="text-xs text-gray-400">2w geleden</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Actions */}
                  <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">Pipeline Acties</h3>
                        <p className="text-gray-400">Beheer je sales activiteiten</p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Export Data
                        </button>
                        <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Rapportage
                        </button>
                        <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Nieuwe Deal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  {/* Team Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Team Overzicht</h1>
                      <p className="text-gray-400">Beheer je teamleden en hun rollen</p>
                    </div>
                    <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      + Nieuw Teamlid
                    </button>
                  </div>

                  {/* Team Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#E2017A]/20 rounded-lg">
                          <svg className="w-6 h-6 text-[#E2017A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Totaal Teamleden</p>
                          <p className="text-2xl font-bold text-white">24</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Actieve Projecten</p>
                          <p className="text-2xl font-bold text-white">18</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Gemiddelde Uren</p>
                          <p className="text-2xl font-bold text-white">38.5</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-gray-700 p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Productiviteit</p>
                          <p className="text-2xl font-bold text-white">87%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Studio Department */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Studio</h3>
                        <span className="bg-[#E2017A]/20 text-[#E2017A] text-xs px-2 py-1 rounded-full">8 leden</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Creative Director</span>
                          <span className="text-sm text-white">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Senior Designer</span>
                          <span className="text-sm text-white">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Junior Designer</span>
                          <span className="text-sm text-white">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Art Director</span>
                          <span className="text-sm text-white">2</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Totaal Uren</span>
                          <span className="text-sm text-white font-medium">312</span>
                        </div>
                      </div>
                    </div>

                    {/* Buitendienst Department */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Buitendienst</h3>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">6 leden</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Account Manager</span>
                          <span className="text-sm text-white">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Sales Representative</span>
                          <span className="text-sm text-white">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Business Developer</span>
                          <span className="text-sm text-white">1</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Totaal Uren</span>
                          <span className="text-sm text-white font-medium">234</span>
                        </div>
                      </div>
                    </div>

                    {/* Administratie & Planning Department */}
                    <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Administratie & Planning</h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">10 leden</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Project Coordinator</span>
                          <span className="text-sm text-white">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Administratief Medewerker</span>
                          <span className="text-sm text-white">4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Planner</span>
                          <span className="text-sm text-white">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Office Manager</span>
                          <span className="text-sm text-white">1</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Totaal Uren</span>
                          <span className="text-sm text-white font-medium">380</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Table */}
                  <div className="bg-black/40 rounded-lg border border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Alle Teamleden</h3>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Zoek teamleden..."
                            className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm w-64"
                          />
                          <select className="bg-[#111111] border border-gray-700 text-white px-3 py-2 rounded-md text-sm">
                            <option>Alle Afdelingen</option>
                            <option>Studio</option>
                            <option>Buitendienst</option>
                            <option>Administratie & Planning</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-black/20">
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Teamlid</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Rol</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Afdeling</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Status</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Projecten</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Uren Deze Week</th>
                            <th className="text-left py-3 px-6 text-[#E2017A] font-medium">Acties</th>
                          </tr>
                        </thead>
                        <tbody className="text-white">
                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#E2017A] rounded-full flex items-center justify-center text-white font-bold">
                                  RS
                                </div>
                                <div>
                                  <div className="font-medium">Ron Stoel</div>
                                  <div className="text-sm text-gray-400">ron@vanhaaster.nl</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-medium">Creative Director</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 bg-[#E2017A]/20 text-[#E2017A] rounded-full text-xs font-medium`}>
                                Studio
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">5 projecten</div>
                                <div className="text-gray-400">€45.230 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">42 uur</div>
                                <div className="text-gray-400">van 40 uur</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  LV
                                </div>
                                <div>
                                  <div className="font-medium">Lisa de Vries</div>
                                  <div className="text-sm text-gray-400">lisa@vanhaaster.nl</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-medium">Senior Designer</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 bg-[#E2017A]/20 text-[#E2017A] rounded-full text-xs font-medium`}>
                                Studio
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">3 projecten</div>
                                <div className="text-gray-400">€18.450 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">38 uur</div>
                                <div className="text-gray-400">van 40 uur</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                  MJ
                                </div>
                                <div>
                                  <div className="font-medium">Mark Jansen</div>
                                  <div className="text-sm text-gray-400">mark@vanhaaster.nl</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-medium">Account Manager</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium`}>
                                Buitendienst
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                Actief
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">4 projecten</div>
                                <div className="text-gray-400">€32.100 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">41 uur</div>
                                <div className="text-gray-400">van 40 uur</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-700/50 hover:bg-black/20">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  SB
                                </div>
                                <div>
                                  <div className="font-medium">Sarah Bakker</div>
                                  <div className="text-sm text-gray-400">sarah@vanhaaster.nl</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-medium">Project Coordinator</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium`}>
                                Administratie & Planning
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                In Afwachting
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">2 projecten</div>
                                <div className="text-gray-400">€12.800 totaal</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium">35 uur</div>
                                <div className="text-gray-400">van 40 uur</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <button className="text-[#E2017A] hover:text-white text-sm">Bekijk</button>
                                <button className="text-gray-400 hover:text-white text-sm">Bewerk</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Paginering */}
                    <div className="px-6 py-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Toon 1-10 van 24 teamleden
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50">
                            Vorige
                          </button>
                          <button className="px-3 py-2 text-sm bg-[#E2017A] text-white rounded-md">1</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">2</button>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">3</button>
                          <span className="px-3 py-2 text-sm text-gray-400">...</span>
                          <button className="px-3 py-2 text-sm text-gray-400 hover:text-white">
                            Volgende
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Actions */}
                  <div className="bg-black/40 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">Team Acties</h3>
                        <p className="text-gray-400">Beheer je team en activiteiten</p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Export Team Data
                        </button>
                        <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Uren Rapportage
                        </button>
                        <button className="bg-[#111111] hover:bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Team Meeting
                        </button>
                        <button className="bg-[#E2017A] hover:bg-[#E2017A]/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Nieuwe Rol
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoicing Tab */}
              {activeTab === 'invoicing' && (
                <div className="text-white">Facturering - Coming Soon</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
